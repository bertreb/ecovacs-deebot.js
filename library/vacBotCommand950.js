const tools = require('./tools.js'),
    Element = require('ltx').Element,
    constants = require('./ecovacsConstants.js');

class VacBotCommand950 {
    constructor(name, args = {}) {
        this.name = name;
        this.args = Object.assign(args, { 'id': getReqID() });
    }

    to_xml() {
        let ctl = new Element('ctl', {
            td: this.name
        });
        for (let key in this.args) {
            if (this.args.hasOwnProperty(key)) {
                let value = this.args[key];
                if (tools.isObject(value)) {
                    ctl.c(key, value);
                } else {
                    ctl.attr(key, value);
                }
            }
        }
        return ctl;
    }

    toString() {
        return this.command_name() + ' command';
    }

    command_name() {
        return this.name.toLowerCase();
    }
}

class Clean extends VacBotCommand950 {
    constructor(mode = 'auto', action = 'start', kwargs = {}) {
        let initCmd = {
            'type': constants.CLEAN_MODE_TO_OZMO950[mode],
            'speed': constants.FAN_SPEED_TO_OZMO950['normal'],
            'act': constants.CLEAN_ACTION_TO_OZMO950[action]
        };
        for (let key in kwargs) {
            if (kwargs.hasOwnProperty(key)) {
                initCmd[key] = kwargs[key];
            }
        }
        tools.envLog('initCmd %s', initCmd);
        super('Clean', initCmd);
    }
}

function getReqID(customid = '0') {
    // Generate a somewhat random string for request id, with minium 8 chars. Works similar to ecovacs app
    // This is required for the Ozmo 930
    if (customid !== '0') {
        rtnval = customid; // return provided id as string
    } else {
        rtnval = Math.floor(Math.random() * 99999999) + 1;
    }
    return rtnval.toString(); // return as string
}

class Edge extends Clean {
    constructor() {
        super('edge', 'start');
    }
}

class Spot extends Clean {
    constructor() {
        super('spot', 'start'
        //, {'content':'-291,111'}
        ); 
        // requires content, not included to not start the bot without knowing what happens
    }
}

class Pause extends VacBotCommand950 {
    constructor() {
        super('clean', {'act': 'pause'});
    }
}

class Resume extends VacBotCommand950 {
    constructor() {
        super('clean', {'act': 'resume'});
    }
}

class Stop extends VacBotCommand950 {
    constructor() {
        super('clean',  {'act': 'stop'});
    }
}

class SpotArea extends Clean {
    constructor(action = 'start', area = '') {
        if (area !== '') {
            super('spotArea', action, {'content': area, 'count': '1'});
        }
    }
}

class CustomArea extends Clean {
    constructor(action = 'start', map_position = '', cleanings = 1) {
        if (map_position !== '') {
            super('customArea', action, {'content': map_position, 'count': cleanings});
        }
    }
}

class Charge extends VacBotCommand950 {
    constructor() {
        super('Charge', {'act': constants.CHARGE_MODE_TO_OZMO950['return']}
        );
    }
}

class GetDeviceInfo extends VacBotCommand950 {
    constructor() {
        super('GetDeviceInfo');
    }
}

class GetCleanState extends VacBotCommand950 {
    constructor() {
        super('GetCleanState');
    }
}

class GetChargeState extends VacBotCommand950 {
    constructor() {
        super('GetChargeState');
    }
}

class GetBatteryState extends VacBotCommand950 {
    constructor() {
        super('GetBatteryInfo');
    }
}

class GetLifeSpan extends VacBotCommand950 {
    constructor(component) {
        super('GetLifeSpan', {'type': constants.COMPONENT_TO_ECOVACS[component]});
    }
}

class SetTime extends VacBotCommand950 {
    constructor(timestamp, timezone) {
        super('SetTime', {
            'time': {
                't': timestamp,
                'tz': timezone
            }
        });
    }
}

class GetCleanSpeed extends VacBotCommand950 {
    constructor(component) {
        super('GetCleanSpeed');
    }
}

class SetWaterLevel extends VacBotCommand950 {
    constructor(level) {
        if (constants.WATER_LEVEL_TO_ECOVACS.hasOwnProperty(level)) {
            level = constants.WATER_LEVEL_TO_ECOVACS[level];
        }
        super('SetWaterPermeability', {
            'amount': level
        });
    }
}

class GetWaterLevel extends VacBotCommand950 {
    constructor() {
        super('GetWaterPermeability');
    }
}

class GetWaterBoxInfo extends VacBotCommand950 {
    constructor() {
        super('GetWaterBoxInfo');
    }
}

class GetDeebotPos extends VacBotCommand950 {
    constructor() {
        super('GetDeebotPos');
    }
}

class PlaySound extends VacBotCommand950 {
    constructor(sid = '0') {
        super('PlaySound', {'count': 1, 'sid': sid});
    }
}

module.exports.Clean = Clean;
module.exports.Edge = Edge;
module.exports.Spot = Spot;
module.exports.SpotArea = SpotArea;
module.exports.CustomArea = CustomArea;
module.exports.Stop = Stop;
module.exports.Pause = Pause;
module.exports.Resume = Resume;
module.exports.Charge = Charge;
module.exports.GetDeebotPos = GetDeebotPos;
module.exports.GetDeviceInfo = GetDeviceInfo;
module.exports.GetCleanState = GetCleanState;
module.exports.GetChargeState = GetChargeState;
module.exports.GetBatteryState = GetBatteryState;
module.exports.GetLifeSpan = GetLifeSpan;
module.exports.SetTime = SetTime;
module.exports.GetCleanSpeed = GetCleanSpeed;
module.exports.GetWaterLevel = GetWaterLevel;
module.exports.SetWaterLevel = SetWaterLevel;
module.exports.GetWaterBoxInfo = GetWaterBoxInfo;
module.exports.PlaySound = PlaySound;
