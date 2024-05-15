#include <ESP8266WiFi.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_MLX90614.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include "MAX30102_PulseOximeter.h"

/*********HTTP REST and server Configuration**************/
#define HTTP_REST_PORT 80
#define WIFI_RETRY_DELAY 500
#define MAX_WIFI_INIT_RETRY 50
ESP8266WebServer http_rest_server(HTTP_REST_PORT);

IPAddress local_IP(192, 168, 100, 250);    // Static IP address
IPAddress gateway(192, 168, 100, 1);      // Gateway IP
IPAddress subnet(255, 255, 255, 0);

const char* wifi_ssid = "CHEWYLYYABU";
const char* wifi_passwd = "wechangepassw0rd$";

Adafruit_MLX90614 mlx = Adafruit_MLX90614();

// Pulse Oximeter configuration
PulseOximeter pox;
uint32_t tsLastReport = 0;
const unsigned long REPORTING_PERIOD_MS = 1000;

// Function prototypes
int init_wifi();
void config_rest_server_routing();
void get_temperature();
float smooth();
void onBeatDetected();

// Variables for temperature monitoring
unsigned long tempStartReport;
unsigned long tempCurrentReport;
unsigned long tempSampleReport;
const unsigned long PREPARE_TEMP = 5000; // Time in milliseconds for temperature preparation
const int samples = 10;
float readings[samples];
int readIndex = 0;
float total = 0;
float tempAvg = 0;

void setup() {
  Serial.begin(115200);
  if (init_wifi() == WL_CONNECTED) {
    Serial.println("WIFI Connected");
    Serial.print("@ ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("Error connecting to WiFi");
  }

  // Initialize MLX90614 sensor
  if (!mlx.begin()) {
    Serial.println("Failed to initialize MLX90614 sensor");
    while (1);
  }

  // Initialize Pulse Oximeter
  if (!pox.begin()) {
    Serial.println("FAILED to initialize MAX30102 pulse oximeter");
    while (1);
  }
  pox.setIRLedCurrent(MAX30102_LED_CURR_7_6MA);
  pox.setOnBeatDetectedCallback(onBeatDetected);

  config_rest_server_routing();
  http_rest_server.sendHeader("Access-Control-Allow-Origin", "*");
  http_rest_server.enableCORS(true);
  http_rest_server.begin(); 
  Serial.println(F("HTTP REST Server Started"));
  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);
}

void loop() {
  http_rest_server.handleClient();
  pox.update(); // Update pulse oximeter data
  
  if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
    Serial.print("Heart rate:");
    Serial.print(pox.getHeartRate());
    Serial.print("bpm / SpO2:");
    Serial.print(pox.getSpO2());
    Serial.print("%");
    Serial.println();
    tsLastReport = millis();
  }
  
  // Temperature monitoring
  get_temperature();
}

// Function definitions

int init_wifi() {
  Serial.println(F("Connecting to WiFi ..."));
  WiFi.mode(WIFI_STA);
  if (!WiFi.config(local_IP, gateway, subnet)) {
    Serial.println("STA Failed to configure");
  }
  WiFi.begin(wifi_ssid, wifi_passwd);
  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < MAX_WIFI_INIT_RETRY) {
    Serial.print(".");
    delay(WIFI_RETRY_DELAY);
    retries++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    return WL_CONNECTED;
  } else {
    return WiFi.status();
  }
}

void config_rest_server_routing() {
  http_rest_server.on("/tempdata", HTTP_GET, get_temperature);
}

void get_temperature() {
  Serial.println(F("HTTP GET for Temperature Sensor"));
  StaticJsonDocument <128> jsonDoc;
  float rawTempAvg = 0.0;
  tempStartReport = millis();
  tempCurrentReport = millis();
  tempSampleReport = millis();
  while (tempCurrentReport - tempStartReport < PREPARE_TEMP){
    if (tempCurrentReport - tempSampleReport >= 10){
      tempAvg = smooth();
      Serial.print("Measure");
      tempSampleReport = tempCurrentReport;
    }
    tempCurrentReport = millis();
    Serial.print(tempCurrentReport - tempSampleReport);
  }

  Serial.print(F("Monitored: "));
  Serial.println(ESP.getFreeHeap(),DEC);

  tempAvg = ((int)(tempAvg * 100 ))/ 100.0;
   
  jsonDoc["tempAvg"] = tempAvg;                                      
  
  String response;
  serializeJson(jsonDoc, response);
  
  http_rest_server.send(200, "application/json", response);
}

float smooth() {
  float average = 0.0;                    
  total = total - readings[readIndex];    
  float cur_sample = mlx.readObjectTempC();     
  if (isnan(cur_sample)) {
    return average;
  } else {
    readings[readIndex] = cur_sample;       
  }
  total += readings[readIndex];           
  readIndex += 1;                         
  if (readIndex >= samples) {             
    readIndex = 0;                
  }
  average = total / samples;              
  return average;
}