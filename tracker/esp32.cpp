#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <SoftwareSerial.h>

// WiFi credentials
const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";

// Backend server
const char* serverUrl = "http://your-server-address";

// GPS Module pins
const int rxPin = D5;
const int txPin = D6;

// LED pin
const int ledPin = D4;

// Initialize SoftwareSerial for GPS
SoftwareSerial gpsSerial(rxPin, txPin);

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600);

  pinMode(ledPin, OUTPUT);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  // Read GPS data
  String gpsData = "";
  while (gpsSerial.available()) {
    gpsData += (char)gpsSerial.read();
  }

  // Parse GPS data (assuming it's NMEA format)
  float latitude = parseLatitude(gpsData);
  float longitude = parseLongitude(gpsData);

  // Post checkpoint location
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(serverUrl) + "/trackers/update"); // Adjust the endpoint as needed
    http.addHeader("Content-Type", "application/json");

    // Create JSON payload
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["trackerId"] = "your_tracker_id"; // Adjust as needed
    jsonDoc["latitude"] = latitude;
    jsonDoc["longitude"] = longitude;

    String jsonPayload;
    serializeJson(jsonDoc, jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response: " + response);

      // Check for LED command
      StaticJsonDocument<200> responseJson;
      DeserializationError error = deserializeJson(responseJson, response);
      if (!error) {
        const char* command = responseJson["command"];
        if (strcmp(command, "LIGHT_LED") == 0) {
          digitalWrite(ledPin, HIGH);
          delay(1000);
          digitalWrite(ledPin, LOW);
        }
      }
    } else {
      Serial.println("Error on HTTP request");
    }
    http.end();
  }

  // Wait before sending the next update
  delay(5000);
}

float parseLatitude(String gpsData) {
  // Implement NMEA parsing to extract latitude
  // For simplicity, return a dummy value
  return 37.7749;
}

float parseLongitude(String gpsData) {
  // Implement NMEA parsing to extract longitude
  // For simplicity, return a dummy value
  return -122.4194;
}
