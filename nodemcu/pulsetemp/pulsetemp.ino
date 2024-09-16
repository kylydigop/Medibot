#include <stdio.h>
#include <Wire.h>
#include <string.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include <Adafruit_MLX90614.h>
#include "MAX30100_PulseOximeter.h"


//*********HTTP REST and server Configuration**************
#define HTTP_REST_PORT 80
#define WIFI_RETRY_DELAY 500
#define MAX_WIFI_INIT_RETRY 50
ESP8266WebServer http_rest_server(HTTP_REST_PORT);

IPAddress local_IP(10, 42, 0, 250);    // Static IP address
IPAddress gateway(10, 42, 0, 1);      // Gateway IP
IPAddress subnet(255, 255, 255, 0);

const char* wifi_ssid = "kiosk";
const char* wifi_passwd = "wechangepassw0rd$";

//********MAX30100 variables**********
#define REPORTING_PERIOD_MS 1000  // 1 sec delay for reading SpO2 and temp
PulseOximeter pox;                // Define SpO2 sensor as pox
int spo2 = 0;
int spo2comp;
int spo2aux;
int maxNoRead = 0;
int pox_samples = 0;
int bpm = 0;                       // Variable to store the current BPM value
bool pulse_detected = false;       // Flag to indicate if a pulse has been detected

// Callback function that is triggered when a pulse is detected
void onBeatDetected() {
    pulse_detected = true;         // Set pulse_detected flag to true when a pulse is detected
    Serial.println(F("Pulse detected!"));  // Notify that a pulse has been detected
}


//*********MLX90614 variables**************
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
#define REPORTING_PERIOD_MS     1000  
#define PREPARE_TEMP     2000
uint32_t tempStartReport = 0; 
uint32_t tempCurrentReport = 0;
uint32_t tempSampleReport = 0;
float thermtemp = 37.0;                       //Following three variables are for calibration, do keep as comment
float thermmax = 40.0;   
float thermmin = 36.0;
const int samples = 5;                   //Following variables are for Moving Average
float cur_sample = 0.0;
float readings [samples];
float tempAvg = 0.0;
int readIndex = 0;
float total = 0.00;
uint32_t tsLastReport = 0;


//*********Primary Setup Function**************
void setup(void) {
  Serial.begin(115200);
  if (init_wifi() == WL_CONNECTED) {
    Serial.println("WIFI Connected");
    Serial.print("@ ");
    Serial.println(WiFi.localIP());
  }
  else {
    Serial.print("Error connecting");
  }
  config_rest_server_routing();
  http_rest_server.sendHeader("Access-Control-Allow-Origin", "*");
  http_rest_server.enableCORS(true);
  http_rest_server.begin(); 
  Serial.println(F("HTTP REST Server Started"));
  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);


  //******* Start and configuration of MAX30102 *******
    Serial.print(F("Initializing pulse oximeter..."));
    if (!pox.begin()) {
        Serial.println(F("FAILED"));
    } else {
        Serial.println(F("SUCCESS"));
    }
    mlx.begin();  

    pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
    pox.setOnBeatDetectedCallback(onBeatDetected); 
  //  virtualPowerSwitch();
    pox.begin();
}


//*********Primary Loop Function**************
void loop() {
  pox.update();

  http_rest_server.handleClient();
}


//*********WiFi Initialization Function**************
int init_wifi() {
  int retries = 0;
  Serial.println(F("Connecting to WiFi ..."));
  WiFi.mode(WIFI_STA);
  if (!WiFi.config(local_IP, gateway, subnet)) {       // Configure static IP address
    Serial.println("STA Failed to configure");
  }
  WiFi.begin(wifi_ssid, wifi_passwd);                  // Initialize WiFi connect with credentials
  while (WiFi.status() != WL_CONNECTED) {              // check the status of WiFi connection
    Serial.print(".");
    delay(500);
  }
  return WiFi.status();     // return the WiFi connection status
}

//*********Respond to HTTP GET for Pulse Oximeter**************
void get_pox_data() {
  Serial.println(F("HTTP GET for Pulse Oximeter..."));

  StaticJsonBuffer<64> jsonBuffer;  // Increased buffer size to accommodate additional data
  JsonObject& jsonObj = jsonBuffer.createObject();
  char JSONmessageBuffer[64];       // Increased size of message buffer

  pulse_detected = false;  // Reset pulse detection flag
  pox_samples = 0;         // Reset sample counter
  tsLastReport = millis(); // Start reporting timer

  // Loop to gather pulse oximeter data until 10 samples are collected
  while (pox_samples < 10) {
    pox.update();  // Update Pulse Oximeter readings

    // Report data every REPORTING_PERIOD_MS milliseconds
    if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
      spo2 = pox.getSpO2();  // Get SpO2 value
      spo2comp = spo2;       // Comparison to handle invalid readings
      spo2aux = spo2comp;

      // If SpO2 reading is invalid (e.g., 0), attempt to restart the sensor
      if (spo2 == spo2aux && spo2 == 0) {
        maxNoRead += 1;  // Increment no-read counter
        if (maxNoRead == 7) {
          pox.begin();   // Restart the sensor after 7 failed readings
          maxNoRead = 0; // Reset the no-read counter
        }
      }

      // Get the heart rate (BPM) and print to serial monitor
      bpm = pox.getHeartRate();
      Serial.print(F("Reading O2..."));
      Serial.print(F("BPM: "));
      Serial.println(bpm);
      Serial.print(F("SpO2: "));
      Serial.println(spo2);

      // Check for pulse detection and increment sample count
      if (pulse_detected) {
        pox_samples += 1;        // Increment sample count when a pulse is detected
        pulse_detected = false;  // Reset pulse detection flag
      }

      // Update timestamp for the next reading
      tsLastReport = millis();
    }
  }

  // Once 10 samples are collected, prepare and send the data via HTTP
  jsonObj["SpO2"] = spo2;  // Add SpO2 data to the JSON object
  jsonObj["BPM"] = bpm;    // Add the latest BPM value to the JSON object

  jsonObj.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));  // Convert JSON object to string
  http_rest_server.send(200, "application/json", JSONmessageBuffer);  // Send the response

  // Reset variables for the next request
  spo2 = 0;
  bpm = 0;
  pox_samples = 0;
}

//*********Respond to HTTP GET for Temperature**************
void get_temp_data() {
    Serial.println(F("HTTP GET for Temperature Sensor"));
    StaticJsonBuffer<32> jsonBuffer;                    // Create JSON object of size 32 to send data
    JsonObject& jsonObj = jsonBuffer.createObject();
    char JSONmessageBuffer[32];
    float rawTempAvg = 0.0;
    tempStartReport = millis();
    tempCurrentReport = millis();
    tempSampleReport = millis();
    
    // Collect temperature data for PREPARE_TEMP milliseconds
    while (tempCurrentReport - tempStartReport < PREPARE_TEMP) {
        if (tempCurrentReport - tempSampleReport >= 10) {
            tempAvg = smooth();  // Get smoothed temperature with calibration
            Serial.print("Measure: ");
            Serial.println(tempAvg);
            tempSampleReport = tempCurrentReport;
        }
        tempCurrentReport = millis();
    }

    Serial.print(F("Monitored: "));
    Serial.println(ESP.getFreeHeap(), DEC);

    // Format temperature average to 2 decimal places
    tempAvg = ((int)(tempAvg * 100)) / 100.0;

    // Create JSON object and send HTTP response
    jsonObj["tempAvg"] = tempAvg;  // Add Data To Json Object to send data
    jsonObj.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));

    http_rest_server.send(200, "application/json", JSONmessageBuffer);
}

// Calibration function
float calibrateTemp(float rawTemp) {
    // Apply a linear adjustment based on known calibration parameters
    float calibratedTemp = (rawTemp - thermmin) * (thermtemp - thermmin) / (thermmax - thermmin) + thermmin;
    return calibratedTemp;
}

//*********Temperature Read and Smoothing function**************
float smooth() {
    float average = 0.0;                    // Instantiate average
    total = total - readings[readIndex];    // Subtract last reading to not keep on adding
    cur_sample = mlx.readObjectTempC();     // Read the sensor
    if (isnan(cur_sample)) {
        readings[readIndex] = readings[readIndex - 1]; // Use last valid reading
    } else {
        readings[readIndex] = cur_sample;   // Append to array
    }
    total += readings[readIndex];           // Add reading to total
    readIndex += 1;                         // Increment index
    if (readIndex >= samples) {             // Reset index
        readIndex = 0;
    }
    average = total / samples;              // Average temperature
    average = calibrateTemp(average);       // Apply calibration
    return average;
}




//*********Function for REST API Handling**************/
void config_rest_server_routing() {
  http_rest_server.on("/", HTTP_GET, []() {
    http_rest_server.send(200, "text/html",  "TEST REST Web Server");
  });

  http_rest_server.on("/tempdata", HTTP_GET, get_temp_data);
  http_rest_server.on("/poxdata", HTTP_GET, get_pox_data);
}
