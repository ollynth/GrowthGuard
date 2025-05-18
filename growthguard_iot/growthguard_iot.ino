// influxdb integration
#if defined(ESP32)
  #include <WiFiMulti.h>
  WiFiMulti wifiMulti;
  #define DEVICE "ESP32"
  #elif defined(ESP8266)
  #include <ESP8266WiFiMulti.h>
  ESP8266WiFiMulti wifiMulti;
  #define DEVICE "ESP8266"
  #endif
  
#include <DHT.h>
#include <InfluxDbClient.h>
#include <InfluxDbCloud.h>

// WiFi and InfluxDB credentials
#define WIFI_SSID "YOUR_SSID"
#define WIFI_PASSWORD "YOUR_PASSWORD"

#define INFLUXDB_URL "https://us-east-1-1.aws.cloud2.influxdata.com"
#define INFLUXDB_TOKEN "YOUR_OWN_TOKEN"
#define INFLUXDB_ORG "YOUR_ORGANIZATION_ID"
#define INFLUXDB_BUCKET "YOUR_BUCKET_NAME"

// DHT sensor configuration
#define DHTPIN 26     // GPIO 26
#define DHTTYPE DHT11 // Specify the type of DHT sensor
DHT dht(DHTPIN, DHTTYPE); // Create a DHT object
const int moisturePin = 34; // GPIO 34 for soil moisture sensor
const int ledPin = 27; // for LED

// Time zone info
#define TZ_INFO "UTC7"

// Declare InfluxDB client instance with preconfigured InfluxCloud certificate
InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN, InfluxDbCloud2CACert);

// Declare Data point for plant metrics
Point sensor("plant_metrics");

void setup() {
  Serial.begin(115200);

  // Setup wifi
  WiFi.mode(WIFI_STA);
  wifiMulti.addAP(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to wifi");
  while (wifiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }
  Serial.println();

  // Initialize LED 
  pinMode(ledPin, OUTPUT);
  // Initialize DHT sensor
  dht.begin();

  // Accurate time is necessary for certificate validation and writing in batches
  // Syncing progress and the time will be printed to Serial
  timeSync(TZ_INFO, "pool.ntp.org", "time.nis.gov");

  // Check server connection
  if (client.validateConnection()) {
    Serial.print("Connected to InfluxDB: ");
    Serial.println(client.getServerUrl());
  } else {
    Serial.print("InfluxDB connection failed: ");
    Serial.println(client.getLastErrorMessage());
  }

  // Add tags to data point
  sensor.addTag("device", DEVICE);
  sensor.addTag("SSID", WiFi.SSID());
}

void loop() {
  // Clear fields for reusing the point. Tags will remain the same as set in setup.
  sensor.clearFields();

  // Read sensor data
  float humidity = dht.readHumidity();    // Read Humidity
  float temperature = dht.readTemperature(); // Read temperature as Celsius
  int moistureValue = analogRead(moisturePin); //Read moisture value
  int soilMoisturePercent = map(moistureValue, 4095, 0, 0, 100); // Adjust 4095 and 0 based on calibration
  String soilStatus = "";
  int waterStatus = 1;
  
  // Check for DHT failed readings
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    delay(2000); // Wait before retrying
    return;
  }

  // Determine soil condition
  if (soilMoisturePercent > 60 && soilMoisturePercent <= 100) {
    soilStatus = "wet";
  } else if (soilMoisturePercent > 30 && soilMoisturePercent <= 60) {
    soilStatus = "normal";
  } else if (soilMoisturePercent >= 0 && soilMoisturePercent <= 30) {
    soilStatus = "dry";
  }

  // Check water status -- 1 need water
   if ((temperature >= 35 && humidity <= 45) || soilStatus.equals("dry")) {
     waterStatus = 1;
  } else {
    waterStatus = 0;
  }

  
  // Print the DHT results to the Serial Monitor
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" *C");
  Serial.print("Moisture Value: ");
  Serial.println(moistureValue);
  Serial.print("Moisture Level: ");
  Serial.print(soilMoisturePercent);
  Serial.println(" %");

  // Print soil condition to Serial Monitor
  Serial.print("Soil Moisture: ");
  Serial.print(soilMoisturePercent);
  Serial.print(" %\t");
  Serial.print("Soil Condition: ");
  Serial.println(soilStatus);

  // Add sensor data to the point
  sensor.addField("humidity", humidity);
  sensor.addField("temperature", temperature);
  sensor.addField("soil_moisture", soilMoisturePercent);
  sensor.addField("water_status", waterStatus);

  // Print what we are writing to InfluxDB
  Serial.print("Writing: ");
  Serial.println(sensor.toLineProtocol());

  // Check WiFi connection and reconnect if needed
  if (wifiMulti.run() != WL_CONNECTED) {
    Serial.println("Wifi connection lost");
  }

  // Write point to InfluxDB
  if (!client.writePoint(sensor)) {
    Serial.print("InfluxDB write failed: ");
    Serial.println(client.getLastErrorMessage());
  } else {
    Serial.println("Data written to InfluxDB successfully");
  }

  Serial.println("Waiting for next detection");

 if (waterStatus == 1) {
     digitalWrite(ledPin, HIGH);
     delay(900000); // Wait 15 min
     digitalWrite(ledPin, LOW);
  } else {
    delay (1200000); // wait 20 min
  }
}
