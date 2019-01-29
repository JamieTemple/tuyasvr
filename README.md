# tuyasvr
Node.js API for TuyaAPI

**Warning** This code has only been tested on Teckin smart plugs (the really cheap packs of 4 from amazon)

This readme is a work in progress - I only threw this code up here to keep it warm ... but In case anyone wants to use it (and until I write some decent instructions).

1. get this code
2. create a config file
3. run this on your machine running OH (npm start should work)
4. create your items

## config file should look a bit like:
In order for things to work, you need to create a config.json file with details of your devices, and stick it into the same folder as this code.

```
{
    "devices": [
        {
            "id": 1,
            "deviceIp": "172.24.0.XXX",
            "deviceId": "XXXXXXXXXXXXXXXXXXXX",
            "deviceKey": "XXXXXXXXXXXXXXXX"
        },
        {
            "id": 2,
            "deviceIp": "172.24.0.XXX",
            "deviceId": "XXXXXXXXXXXXXXXXXXXX",
            "deviceKey": "XXXXXXXXXXXXXXXX"
        }
    ]
}
```
**IMPORTANT** Each device has it's own UNIQUE deviceKey.


## Items file should look a bit like:

```
Switch  Teckin_Socket_1_State       "Teckin socket 1 State"                 <poweroutlet_uk>    (Power)     { http=">[ON:POST:http://172.24.0.121:3000/sockets/1:ON] >[OFF:POST:http://172.24.0.121:3000/sockets/1:OFF] <[http://172.24.0.121:3000/sockets/1/state:30000:REGEX(\"(.*)\")]" }
Number  Teckin_Socket_1_Voltage     "Teckin socket 1 Voltage [%.2f V]"      <energy>            (Power)     { http="<[http://172.24.0.121:3000/sockets/1/voltage:30000:REGEX((.*))]" }
Number  Teckin_Socket_1_Current     "Teckin socket 1 Current [%.2f mA]"     <energy>            (Power)     { http="<[http://172.24.0.121:3000/sockets/1/current:30000:REGEX((.*))]" }
Number  Teckin_Socket_1_Power       "Teckin socket 1 Power [%.2f W]"        <energy>            (Power)     { http="<[http://172.24.0.121:3000/sockets/1/power:30000:REGEX((.*))]" }
```
Note that you will need to change the IP address to that of your OH server.
Also note that this code polls the devices for state every 30 seconds - change it if you like - I've not fully tested how fast you can poll these sockets safely

## Sitemap file should look a bit like:
```
    Frame label="Teckin socket 1" {
        Default item=Teckin_Socket_1_State
        Default item=Teckin_Socket_1_Current
        Default item=Teckin_Socket_1_Power
        Default item=Teckin_Socket_1_Voltage
    }

```


## Note on power/voltage/current
I have Teckin sockets, where the info returned for power/voltage/current is returned in specific "dp" values.
I think different devices might return this info differently, so if you've not got Teckin sockets, then these bits might not work.
