#include "DHT.h"
#include <WiFi.h>
#include <HTTPClient.h>

// khai bao wifi
const char* SSID = "ngocaodang_tang2";
const char* PASSWORD = "password";
// chan pin ket noi
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
const String deviceId = "60c77855fd044a3a38ce88e9";
int led = 2;

String splitString(String str, String delim, uint16_t pos){
  String tmp = str;
  for(int i=0; i<pos; i++){
    tmp = tmp.substring(tmp.indexOf(delim)+1);
    
    if(tmp.indexOf(delim)== -1 
    && i != pos -1 )
      return "";
  }
  return tmp.substring(0,tmp.indexOf(delim));
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  //ket noi wifi
  WiFi.begin(SSID, PASSWORD);
  Serial.print("\nKet noi toi Wifi.");
  while(WiFi.status() != WL_CONNECTED){
      delay(500);
      Serial.print(".");
    }
  Serial.println("da ket noi toi wifi");
  
  pinMode(led,OUTPUT);
  dht.begin();  
}

// gui du lieu do toi server 
void sendRequest(float temperature, float humidity){
  if(WiFi.status() == WL_CONNECTED){
  
      HTTPClient http;
      if (temperature > 35) char *actorStateRequest = "ON";
      else char *actorStateRequest = "OFF";
      http.begin("http://192.168.1.16:3000/device/editDevice/"+String(deviceId)+"?temperature="+String(temperature)+"&humidity="+String(humidity)+"&actorStateRequest="+actorStateRequest);
      //http.addHeader("Content-Type", "application/json");
      
      http.addHeader("Content-Type", "text/plain");
      int httpResponseCode = http.PUT("put request to server");
      
      //int httpResponseCode = http.POST("ok");
      Serial.println(httpResponseCode);
      if(httpResponseCode == 200){
          Serial.println("Da gui du lieu len server \n");
          String payload = http.getString();
          String state = splitString(payload,",",1);
          String from = splitString(payload,",",2);

          Serial.println(state);
          Serial.println(from);
          if (state == "ON") {
            Serial.print("ON from ");
            Serial.println(from);
            digitalWrite(led,HIGH);
          } else {
            Serial.print("OFF from ");
            Serial.println(from);
            digitalWrite(led,LOW);
          }
          // if(state2 == "ON"){
          //   Serial.println("user on");
          //   digitalWrite(led,HIGH);  
          // }else{
          //   if(state1 == "ON"){
          //     Serial.println("user off, device on");
          //     digitalWrite(led,HIGH);  
          //   }else{
          //     Serial.println("both device and user off");
          //     digitalWrite(led,LOW);  
          //   }
          // }
          
      }else{
        Serial.println("Khong the gui data len server \n");    
      }
    }
  }

void loop() {
  // put your main code here, to run repeatedly:
  delay(3000);

  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if(isnan(t) || isnan(h)){
    Serial.println("Loi doc du lieu tu DHT11");
    return ;  
  }
// day la file cu cua t dung cai rooute thuan, o co taoj file moiko ???
  // in du lieu ra moinitor:
  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.print(F("°C "));


  sendRequest(t,h);

}
