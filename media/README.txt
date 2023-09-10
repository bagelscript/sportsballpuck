# add audio files here, reference from a config.json file in src structure:


{
  "HUE_HOST": "",
  "HUE_USERNAME": "",
  "HUE_LIGHT_IDS": [],
  "HUE_GROUP_ID": "",
  "HUE_GROUP_URL": "",
  "HUE_GROUP_ACTION_URL": "",
  "HUE_RED": {
    "on": true,
    "hue": 0,
    "sat": 254,
    "bri": 254
  },
  "HUE_DIM": {
    "on": true,
    "bri": 1
  },
  "HUE_OFF": {
    "on": false
  },
  "HUE_GREEN": {
    "on": true,
    "hue": 27306,
    "sat": 254,
    "bri": 254
  },
  "TEAMS": [
    {
      "name": "Bucs",
      "fullName": "Tampa Bay Buccaneers",
      "league": "NFL",
      "id": 27,
      "sound": "media/bucs.mp3",
      "light": {
        "on": true,
        "hue": 0,
        "sat": 254,
        "bri": 254
      }
    },
    {
      "name": "Devils",
      "fullName": "New Jersey Devils",
      "league": "NHL",
      "id": 0,
      "sound": "media/devils.mp3",
      "light": {
        "on": true,
        "hue": 0,
        "sat": 254,
        "bri": 254
      }
    },
    {
      "name": "Eagles",
      "fullName": "Philadelphia Eagles",
      "league": "NFL",
      "id": 21,
      "sound": "media/eagles.mp3",
      "light": {
        "on": true,
        "hue": 27306,
        "sat": 254,
        "bri": 254
      }
    }
  ]
}
