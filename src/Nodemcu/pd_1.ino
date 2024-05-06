#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include <string.h>

/*********HTTP REST and server Configuration**************/

#define HTTP_REST_PORT 80
#define WIFI_RETRY_DELAY 500
#define MAX_WIFI_INIT_RETRY 50
ESP8266WebServer http_rest_server(HTTP_REST_PORT);

IPAddress local_IP(192, 168, 137, 2);    // Static IP address
IPAddress gateway(192, 168, 137, 1);     // Gateway IP
IPAddress subnet(255, 255, 255, 0);

const char* wifi_ssid = "DESKTOP-R3J9K4N 8412";
const char* wifi_passwd = "89a\92E1";
void setup() {
  // put your setup code here, to run once:
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

}

void loop() {
  // put your main code here, to run repeatedly:
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
// check the status of WiFi connection
    Serial.print(".");
    delay(500);
  }
  return WiFi.status();     // return the WiFi connection status
}
//*********Function for REST API Handling**************/
void config_rest_server_routing() {
  http_rest_server.on("/", HTTP_GET, []() {
    http_rest_server.send(200, "text/html",  "TEST REST Web Server");
  });

  http_rest_server.on("/hello-world", HTTP_GET, get_hello_world);
  http_rest_server.on("/tempdata", HTTP_GET, get_temperature);
}

void get_hello_world(){
  StaticJsonBuffer<32> jsonBuffer;                    // Create JSON object of size 32 to send data
  JsonObject& jsonObj = jsonBuffer.createObject();
  char JSONmessageBuffer[32];

  jsonObj["msg"] = "hello_world";
  jsonObj.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
  http_rest_server.send(200, "application/json", JSONmessageBuffer);
}

void get_temperature(){
  StaticJsonBuffer<32> jsonBuffer;                    // Create JSON object of size 32 to send data
  JsonObject& jsonObj = jsonBuffer.createObject();
  char JSONmessageBuffer[32];

  jsonObj["tempAvg"] = 37.0;
  jsonObj.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
  http_rest_server.send(200, "application/json", JSONmessageBuffer);
}