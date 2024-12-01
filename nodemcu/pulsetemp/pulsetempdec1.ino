#include <stdio.h> 
#include <Wire.h>
#include <string.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include <Adafruit_MLX90614.h>
#include "MAX30100_PulseOximeter.h"

//********* HTTP REST and server Configuration **********
#define HTTP_REST_PORT 80
#define WIFI_RETRY_DELAY 500
#define MAX_WIFI_INIT_RETRY 50
ESP8266WebServer http_rest_server(HTTP_REST_PORT);

IPAddress local_IP(192, 168, 6, 150);    // Static IP address
IPAddress gateway(192, 168, 6, 4);      // Gateway IP
IPAddress subnet(255, 255, 255, 0);

const char* wifi_ssid = "POCO X4 Pro 5G"; 
const char* wifi_passwd = "1234567890p"; 

//********* MAX30100 variables ******
#define REPORTING_PERIOD_MS 1000  // 1 sec delay for reading SpO2 and temp
PulseOximeter pox;                // Define SpO2 sensor as pox
int spo2 = 0;
int spo2comp;
int spo2aux;
int maxNoRead = 0;
int pox_samples = 0;
int bpm = 0;                       // Variable to store the current BPM value
bool pulse_detected = false;       // Flag to indicate if a pulse has been detected

// Callback function triggered when a pulse is detected
void onBeatDetected() {
    pulse_detected = true;
    Serial.println(F("Pulse detected!"));
}

//********* MLX90614 variables **********
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
#define PREPARE_TEMP 2000
uint32_t tempStartReport = 0; 
uint32_t tempCurrentReport = 0;
uint32_t tempSampleReport = 0;
float thermtemp = 37.0; // Calibration variables
float thermmax = 40.0;
float thermmin = 36.0;
const int samples = 5; // For Moving Average
float cur_sample = 0.0;
float readings[samples];
float tempAvg = 0.0;
int readIndex = 0;
float total = 0.00;
uint32_t tsLastReport = 0;

//********* Ultrasonic sensor variables **********
const int trigPin = 2;  // D4
const int echoPin = 0;  // D3
long duration;
int distance;

// Timer for ultrasonic distance updates
unsigned long lastDistanceUpdate = 0;  // Timestamp for the last distance update
const unsigned long distanceInterval = 1000;  // Interval for updating the distance (1 second)

//********* Primary Setup Function **********
void setup(void) {
    Serial.begin(115200);

    if (init_wifi() == WL_CONNECTED) {
        Serial.println("WIFI Connected");
        Serial.print("@ ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.print("Error connecting");
    }

    config_rest_server_routing();
    http_rest_server.sendHeader("Access-Control-Allow-Origin", "*");
    http_rest_server.enableCORS(true);
    http_rest_server.begin(); 
    Serial.println(F("HTTP REST Server Started"));
    WiFi.setAutoReconnect(true);
    WiFi.persistent(true);

    // Initialize pulse oximeter
    Serial.print(F("Initializing pulse oximeter..."));
    if (!pox.begin()) {
        Serial.println(F("FAILED"));
    } else {
        Serial.println(F("SUCCESS"));
    }
    mlx.begin();
    pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
    pox.setOnBeatDetectedCallback(onBeatDetected);
    pox.begin();

    // Ultrasonic sensor setup
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
}

//********* Primary Loop Function **********
void loop() {
    // Update pulse oximeter data
    pox.update();

    // Handle HTTP requests
    http_rest_server.handleClient();

    // Update distance every second
    unsigned long currentMillis = millis();
    if (currentMillis - lastDistanceUpdate >= distanceInterval) {
        lastDistanceUpdate = currentMillis;
        update_distance();
    }
}

//********* WiFi Initialization Function **********
int init_wifi() {
    Serial.println(F("Connecting to WiFi ..."));
    WiFi.mode(WIFI_STA);
    if (!WiFi.config(local_IP, gateway, subnet)) {       
        Serial.println("STA Failed to configure");
    }
    WiFi.begin(wifi_ssid, wifi_passwd);                  
    while (WiFi.status() != WL_CONNECTED) {              
        Serial.print(".");
        delay(500);
    }
    return WiFi.status();
}

// Function to calculate and update the distance
void update_distance() {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    duration = pulseIn(echoPin, HIGH);
    distance = duration * 0.034 / 2;
    Serial.print("Updated Distance: ");
    Serial.println(distance);  // Log the updated distance
}

//********* Respond to HTTP GET for Ultrasonic Distance **********
void get_distance_data() {
    Serial.println(F("HTTP GET for Ultrasonic Distance Sensor"));
    StaticJsonBuffer<32> jsonBuffer;
    JsonObject& jsonObj = jsonBuffer.createObject();
    char JSONmessageBuffer[32];

    jsonObj["Distance"] = distance;  // Use the global distance variable
    jsonObj.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    http_rest_server.send(200, "application/json", JSONmessageBuffer);
}

//********* Respond to HTTP GET for Pulse Oximeter **********
void get_pox_data() {
    Serial.println(F("HTTP GET for Pulse Oximeter..."));
    StaticJsonBuffer<64> jsonBuffer; 
    JsonObject& jsonObj = jsonBuffer.createObject();
    char JSONmessageBuffer[64];

    pulse_detected = false;
    pox_samples = 0;
    tsLastReport = millis();

    while (pox_samples < 10) {
        pox.update();
        if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
            spo2 = pox.getSpO2();
            spo2comp = spo2;
            spo2aux = spo2comp;

            if (spo2 == spo2aux && spo2 == 0) {
                maxNoRead += 1;
                if (maxNoRead == 7) {
                    pox.begin();
                    maxNoRead = 0;
                }
            }
            bpm = pox.getHeartRate();
            Serial.print(F("Reading O2... BPM: "));
            Serial.print(bpm);
            Serial.print(F(" SpO2: "));
            Serial.println(spo2);

            if (pulse_detected) {
                pox_samples += 1;
                pulse_detected = false;
            }
            tsLastReport = millis();
        }
    }

    jsonObj["SpO2"] = spo2;
    jsonObj["BPM"] = bpm;
    jsonObj.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    http_rest_server.send(200, "application/json", JSONmessageBuffer);
    spo2 = 0;
    bpm = 0;
    pox_samples = 0;
}

//********* Respond to HTTP GET for Temperature **********
void get_temp_data() {
    Serial.println(F("HTTP GET for Temperature Sensor"));
    StaticJsonBuffer<32> jsonBuffer;
    JsonObject& jsonObj = jsonBuffer.createObject();
    char JSONmessageBuffer[32];
    tempStartReport = millis();
    tempCurrentReport = millis();
    tempSampleReport = millis();

    while (tempCurrentReport - tempStartReport < PREPARE_TEMP) {
        if (tempCurrentReport - tempSampleReport >= 10) {
            tempAvg = smooth();
            Serial.print("Measure: ");
            Serial.println(tempAvg);
            tempSampleReport = tempCurrentReport;
        }
        tempCurrentReport = millis();
    }

    tempAvg = ((int)(tempAvg * 100)) / 100.0;
    jsonObj["tempAvg"] = tempAvg;
    jsonObj.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    http_rest_server.send(200, "application/json", JSONmessageBuffer);
}

//********* Calibration and Temperature Smoothing **********
float smooth() {
    total = total - readings[readIndex];
    cur_sample = mlx.readObjectTempC();
    if (isnan(cur_sample)) {
        readings[readIndex] = readings[readIndex - 1];
    } else {
        readings[readIndex] = cur_sample;
    }
    total += readings[readIndex];
    readIndex += 1;
    if (readIndex >= samples) {
        readIndex = 0;
    }
    float average = total / samples;
    return calibrateTemp(average);
}

float calibrateTemp(float rawTemp) {
    return (rawTemp - thermmin) * (thermtemp - thermmin) / (thermmax - thermmin) + thermmin;
}

//********* REST API Handling **********
void config_rest_server_routing() {
    http_rest_server.on("/", HTTP_GET, []() {
        http_rest_server.send(200, "text/html",  "TEST REST Web Server");
    });

    http_rest_server.on("/tempdata", HTTP_GET, get_temp_data);
    http_rest_server.on("/poxdata", HTTP_GET, get_pox_data);
    http_rest_server.on("/distance", HTTP_GET, get_distance_data);
}