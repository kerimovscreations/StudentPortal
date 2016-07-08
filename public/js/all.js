//! moment.js
//! version : 2.12.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(arguments).join(', ') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function isObject(input) {
        return Object.prototype.toString.call(input) === '[object Object]';
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    // internal storage for locale config files
    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale');
                config = mergeConfigs(locales[name]._config, config);
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    config = mergeConfigs(locales[config.parentLocale]._config, config);
                } else {
                    // treat as if there is no base config
                    deprecateSimple('parentLocaleUndefined',
                            'specified parentLocale is not defined yet');
                }
            }
            locales[name] = new Locale(config);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale;
            if (locales[name] != null) {
                config = mergeConfigs(locales[name]._config, config);
            }
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function locale_locales__listLocales() {
        return Object.keys(locales);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function get_set__set (mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        return isArray(this._months) ? this._months[m.month()] :
            this._months[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (typeof value !== 'number') {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')$', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')$', 'i');
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        //the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(utils_hooks__hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        if (!valid__isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date(utils_hooks__hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             if (this.isValid() && other.isValid()) {
                 return other < this ? this : other;
             } else {
                 return valid__createInvalid();
             }
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return valid__createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = ((string || '').match(matcher) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
            } else if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(matchOffset, this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-)?P(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)W)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format]() : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return +this > +localInput;
        } else {
            return +localInput < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return +this < +localInput;
        } else {
            return +this.clone().endOf(units) < +localInput;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return +this === +localInput;
        } else {
            inputMs = +localInput;
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            delta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if (isFunction(Date.prototype.toISOString)) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = local__createLocal([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add               = add_subtract__add;
    momentPrototype__proto.calendar          = moment_calendar__calendar;
    momentPrototype__proto.clone             = clone;
    momentPrototype__proto.diff              = diff;
    momentPrototype__proto.endOf             = endOf;
    momentPrototype__proto.format            = format;
    momentPrototype__proto.from              = from;
    momentPrototype__proto.fromNow           = fromNow;
    momentPrototype__proto.to                = to;
    momentPrototype__proto.toNow             = toNow;
    momentPrototype__proto.get               = getSet;
    momentPrototype__proto.invalidAt         = invalidAt;
    momentPrototype__proto.isAfter           = isAfter;
    momentPrototype__proto.isBefore          = isBefore;
    momentPrototype__proto.isBetween         = isBetween;
    momentPrototype__proto.isSame            = isSame;
    momentPrototype__proto.isSameOrAfter     = isSameOrAfter;
    momentPrototype__proto.isSameOrBefore    = isSameOrBefore;
    momentPrototype__proto.isValid           = moment_valid__isValid;
    momentPrototype__proto.lang              = lang;
    momentPrototype__proto.locale            = locale;
    momentPrototype__proto.localeData        = localeData;
    momentPrototype__proto.max               = prototypeMax;
    momentPrototype__proto.min               = prototypeMin;
    momentPrototype__proto.parsingFlags      = parsingFlags;
    momentPrototype__proto.set               = getSet;
    momentPrototype__proto.startOf           = startOf;
    momentPrototype__proto.subtract          = add_subtract__subtract;
    momentPrototype__proto.toArray           = toArray;
    momentPrototype__proto.toObject          = toObject;
    momentPrototype__proto.toDate            = toDate;
    momentPrototype__proto.toISOString       = moment_format__toISOString;
    momentPrototype__proto.toJSON            = toJSON;
    momentPrototype__proto.toString          = toString;
    momentPrototype__proto.unix              = unix;
    momentPrototype__proto.valueOf           = to_type__valueOf;
    momentPrototype__proto.creationData      = creationData;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months            =        localeMonths;
    prototype__proto._months           = defaultLocaleMonths;
    prototype__proto.monthsShort       =        localeMonthsShort;
    prototype__proto._monthsShort      = defaultLocaleMonthsShort;
    prototype__proto.monthsParse       =        localeMonthsParse;
    prototype__proto._monthsRegex      = defaultMonthsRegex;
    prototype__proto.monthsRegex       = monthsRegex;
    prototype__proto._monthsShortRegex = defaultMonthsShortRegex;
    prototype__proto.monthsShortRegex  = monthsShortRegex;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes <= 1           && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   <= 1           && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    <= 1           && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  <= 1           && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   <= 1           && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.12.0';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.now                   = now;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.updateLocale          = updateLocale;
    utils_hooks__hooks.locales               = locale_locales__listLocales;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
    utils_hooks__hooks.prototype             = momentPrototype;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
!function(){"use strict";function t(t,e,a,i,n,r){var o=this;this.date=moment(n),this.minDate=r.minDate&&moment(r.minDate).isValid()?moment(r.minDate):null,this.maxDate=r.maxDate&&moment(r.maxDate).isValid()?moment(r.maxDate):null,this.displayFormat=r.displayFormat||"ddd, MMM DD",this.dateFilter=angular.isFunction(r.dateFilter)?r.dateFilter:null,this.selectingYear=!1,this.minDate&&this.maxDate&&this.maxDate.isBefore(this.minDate)&&(this.maxDate=moment(this.minDate).add(1,"days")),this.date&&(this.minDate&&this.date.isBefore(this.minDate)&&(this.date=moment(this.minDate)),this.maxDate&&this.date.isAfter(this.maxDate)&&(this.date=moment(this.maxDate))),this.yearItems={currentIndex_:0,PAGE_SIZE:5,START:o.minDate?o.minDate.year():1900,END:o.maxDate?o.maxDate.year():0,getItemAtIndex:function(t){return this.currentIndex_<t&&(this.currentIndex_=t),this.START+t},getLength:function(){return Math.min(this.currentIndex_+Math.floor(this.PAGE_SIZE/2),Math.abs(this.START-this.END)+1)}},t.$mdMedia=a,t.year=this.date.year(),this.selectYear=function(e){o.date.year(e),t.year=e,o.selectingYear=!1,o.animate()},this.showYear=function(){o.yearTopIndex=o.date.year()-o.yearItems.START+Math.floor(o.yearItems.PAGE_SIZE/2),o.yearItems.currentIndex_=o.date.year()-o.yearItems.START+1,o.selectingYear=!0},this.showCalendar=function(){o.selectingYear=!1},this.cancel=function(){e.cancel()},this.confirm=function(){var t=this.date;this.minDate&&this.date.isBefore(this.minDate)&&(t=moment(this.minDate)),this.maxDate&&this.date.isAfter(this.maxDate)&&(t=moment(this.maxDate)),e.hide(t.toDate())},this.animate=function(){o.animating=!0,i(angular.noop).then(function(){o.animating=!1})}}function e(t){var e=this;this.dow=moment.localeData().firstDayOfWeek(),this.weekDays=[].concat(moment.weekdaysMin().slice(this.dow),moment.weekdaysMin().slice(0,this.dow)),this.daysInMonth=[],this.getDaysInMonth=function(){var t=e.date.daysInMonth(),a=moment(e.date).date(1).day()-this.dow;0>a&&(a=this.weekDays.length-1);for(var i=[],n=1;a+t>=n;n++){var r=null;n>a&&(r={value:n-a,enabled:e.isDayEnabled(moment(e.date).date(n-a).toDate())}),i.push(r)}return i},this.isDayEnabled=function(t){return!(this.minDate&&!(this.minDate<=t)||this.maxDate&&!(this.maxDate>=t)||e.dateFilter&&e.dateFilter(t))},this.selectDate=function(t){e.date.date(t)},this.nextMonth=function(){e.date.add(1,"months")},this.prevMonth=function(){e.date.subtract(1,"months")},this.updateDaysInMonth=function(){e.daysInMonth=e.getDaysInMonth()},t.$watch(function(){return e.date.unix()},function(t,a){t&&t!==a&&e.updateDaysInMonth()}),e.updateDaysInMonth()}function a(t,e){return!t||angular.isDate(t)||moment(t,e,!0).isValid()}function i(t,e,a){var a=moment(a,"YYYY-MM-DD",!0),i=angular.isDate(t)?moment(t):moment(t,e,!0);return!t||angular.isDate(t)||!a.isValid()||i.isSameOrAfter(a)}function n(t,e,a){var a=moment(a,"YYYY-MM-DD",!0),i=angular.isDate(t)?moment(t):moment(t,e,!0);return!t||angular.isDate(t)||!a.isValid()||i.isSameOrBefore(a)}function r(t,e,a){var i=angular.isDate(t)?moment(t):moment(t,e,!0);return!t||angular.isDate(t)||!angular.isFunction(a)||!a(i)}function o(t,e,a,i,n){var r=this;this.VIEW_HOURS=1,this.VIEW_MINUTES=2,this.currentView=this.VIEW_HOURS,this.time=moment(a),this.autoSwitch=!!i,this.clockHours=parseInt(this.time.format("h")),this.clockMinutes=parseInt(this.time.minutes()),t.$mdMedia=n,this.switchView=function(){r.currentView=r.currentView==r.VIEW_HOURS?r.VIEW_MINUTES:r.VIEW_HOURS},this.setAM=function(){r.time.hours()>=12&&r.time.hour(r.time.hour()-12)},this.setPM=function(){r.time.hours()<12&&r.time.hour(r.time.hour()+12)},this.cancel=function(){e.cancel()},this.confirm=function(){e.hide(this.time.toDate())}}function s(t){var e="hours",a="minutes",i=this;this.STEP_DEG=30,this.steps=[],this.CLOCK_TYPES={hours:{range:12},minutes:{range:60}},this.getPointerStyle=function(){var t=1;switch(i.type){case e:t=12;break;case a:t=60}var n=Math.round(i.selected*(360/t))-180;return{"-webkit-transform":"rotate("+n+"deg)","-ms-transform":"rotate("+n+"deg)",transform:"rotate("+n+"deg)"}},this.setTimeByDeg=function(t){t=t>=360?0:t;var n=0;switch(i.type){case e:n=12;break;case a:n=60}i.setTime(Math.round(n/360*t))},this.setTime=function(t,n){switch(this.selected=t,i.type){case e:"PM"==i.time.format("A")&&(t+=12),this.time.hours(t);break;case a:t>59&&(t-=60),this.time.minutes(t)}},this.init=function(){switch(i.type=i.type||"hours",i.type){case e:for(var t=1;12>=t;t++)i.steps.push(t);i.selected=i.time.hours()||0,i.selected>12&&(i.selected-=12);break;case a:for(var t=5;55>=t;t+=5)i.steps.push(t);i.steps.push(0),i.selected=i.time.minutes()||0}},this.init()}var d=angular.module("mdPickers",["ngMaterial","ngAnimate","ngAria"]);d.config(["$mdIconProvider","mdpIconsRegistry",function(t,e){angular.forEach(e,function(e,a){t.icon(e.id,e.url)})}]),d.run(["$templateCache","mdpIconsRegistry",function(t,e){angular.forEach(e,function(e,a){t.put(e.url,e.svg)})}]),d.constant("mdpIconsRegistry",[{id:"mdp-chevron-left",url:"mdp-chevron-left.svg",svg:'<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'},{id:"mdp-chevron-right",url:"mdp-chevron-right.svg",svg:'<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'},{id:"mdp-access-time",url:"mdp-access-time.svg",svg:'<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>'},{id:"mdp-event",url:"mdp-event.svg",svg:'<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'}]),d.directive("ngMessage",["$mdUtil",function(t){return{restrict:"EA",priority:101,compile:function(e){var a=t.getClosest(e,"mdp-time-picker",!0)||t.getClosest(e,"mdp-date-picker",!0);if(a)return e.toggleClass("md-input-message-animation",!0),{}}}}]),d.provider("$mdpDatePicker",function(){var e="OK",a="Cancel",i="ddd, MMM DD";this.setDisplayFormat=function(t){i=t},this.setOKButtonLabel=function(t){e=t},this.setCancelButtonLabel=function(t){a=t},this.$get=["$mdDialog",function(n){var r=function(r,o){return angular.isDate(r)||(r=Date.now()),angular.isObject(o)||(o={}),o.displayFormat=i,n.show({controller:["$scope","$mdDialog","$mdMedia","$timeout","currentDate","options",t],controllerAs:"datepicker",clickOutsideToClose:!0,template:'<md-dialog aria-label="" class="mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }"><md-dialog-content layout="row" layout-wrap><div layout="column" layout-align="start center"><md-toolbar layout-align="start start" flex class="mdp-datepicker-date-wrapper md-hue-1 md-primary" layout="column"><span class="mdp-datepicker-year" ng-click="datepicker.showYear()" ng-class="{ \'active\': datepicker.selectingYear }">{{ datepicker.date.format(\'YYYY\') }}</span><span class="mdp-datepicker-date" ng-click="datepicker.showCalendar()" ng-class="{ \'active\': !datepicker.selectingYear }">{{ datepicker.date.format(datepicker.displayFormat) }}</span> </md-toolbar></div><div><div class="mdp-datepicker-select-year mdp-animation-zoom" layout="column" layout-align="center start" ng-if="datepicker.selectingYear"><md-virtual-repeat-container md-auto-shrink md-top-index="datepicker.yearTopIndex"><div flex md-virtual-repeat="item in datepicker.yearItems" md-on-demand class="repeated-year"><span class="md-button" ng-click="datepicker.selectYear(item)" md-ink-ripple ng-class="{ \'md-primary current\': item == year }">{{ item }}</span></div></md-virtual-repeat-container></div><mdp-calendar ng-if="!datepicker.selectingYear" class="mdp-animation-zoom" date="datepicker.date" min-date="datepicker.minDate" date-filter="datepicker.dateFilter" max-date="datepicker.maxDate"></mdp-calendar><md-dialog-actions layout="row"><span flex></span><md-button ng-click="datepicker.cancel()" aria-label="'+a+'">'+a+'</md-button><md-button ng-click="datepicker.confirm()" class="md-primary" aria-label="'+e+'">'+e+"</md-button></md-dialog-actions></div></md-dialog-content></md-dialog>",targetEvent:o.targetEvent,locals:{currentDate:r,options:o},skipHide:!0})};return r}]}),d.directive("mdpCalendar",["$animate",function(t){return{restrict:"E",bindToController:{date:"=",minDate:"=",maxDate:"=",dateFilter:"="},template:'<div class="mdp-calendar"><div layout="row" layout-align="space-between center"><md-button aria-label="previous month" class="md-icon-button" ng-click="calendar.prevMonth()"><md-icon md-svg-icon="mdp-chevron-left"></md-icon></md-button><div class="mdp-calendar-monthyear" ng-show="!calendar.animating">{{ calendar.date.format("MMMM YYYY") }}</div><md-button aria-label="next month" class="md-icon-button" ng-click="calendar.nextMonth()"><md-icon md-svg-icon="mdp-chevron-right"></md-icon></md-button></div><div layout="row" layout-align="space-around center" class="mdp-calendar-week-days" ng-show="!calendar.animating"><div layout layout-align="center center" ng-repeat="d in calendar.weekDays track by $index">{{ d }}</div></div><div layout="row" layout-align="start center" layout-wrap class="mdp-calendar-days" ng-class="{ \'mdp-animate-next\': calendar.animating }" ng-show="!calendar.animating" md-swipe-left="calendar.nextMonth()" md-swipe-right="calendar.prevMonth()"><div layout layout-align="center center" ng-repeat-start="day in calendar.daysInMonth track by $index" ng-class="{ \'mdp-day-placeholder\': !day }"><md-button class="md-icon-button md-raised" aria-label="Select day" ng-if="day" ng-class="{ \'md-accent\': calendar.date.date() == day.value }" ng-click="calendar.selectDate(day.value)" ng-disabled="!day.enabled">{{ day.value }}</md-button></div><div flex="100" ng-if="($index + 1) % 7 == 0" ng-repeat-end></div></div></div>',controller:["$scope",e],controllerAs:"calendar",link:function(e,a,i,n){var r=[a[0].querySelector(".mdp-calendar-week-days"),a[0].querySelector(".mdp-calendar-days"),a[0].querySelector(".mdp-calendar-monthyear")].map(function(t){return angular.element(t)});e.$watch(function(){return n.date.format("YYYYMM")},function(e,a){var i=null;if(e>a?i="mdp-animate-next":a>e&&(i="mdp-animate-prev"),i)for(var n in r)r[n].addClass(i),t.removeClass(r[n],i)})}}}]),d.directive("mdpDatePicker",["$mdpDatePicker","$timeout",function(t,e){return{restrict:"E",require:"ngModel",transclude:!0,template:function(t,e){var a=angular.isDefined(e.mdpNoFloat),i=angular.isDefined(e.mdpPlaceholder)?e.mdpPlaceholder:"",n=angular.isDefined(e.mdpOpenOnClick)?!0:!1;return'<div layout layout-align="start start"><md-button'+(angular.isDefined(e.mdpDisabled)?' ng-disabled="disabled"':"")+' class="md-icon-button" ng-click="showPicker($event)"><md-icon md-svg-icon="mdp-event"></md-icon></md-button><md-input-container'+(a?" md-no-float":"")+' md-is-error="isError()"><input type="{{ ::type }}"'+(angular.isDefined(e.mdpDisabled)?' ng-disabled="disabled"':"")+' aria-label="'+i+'" placeholder="'+i+'"'+(n?' ng-click="showPicker($event)" ':"")+" /></md-input-container></div>"},scope:{minDate:"=mdpMinDate",maxDate:"=mdpMaxDate",dateFilter:"=mdpDateFilter",dateFormat:"@mdpFormat",placeholder:"@mdpPlaceholder",noFloat:"=mdpNoFloat",openOnClick:"=mdpOpenOnClick",disabled:"=?mdpDisabled"},link:{pre:function(t,e,a,i,n){},post:function(e,o,s,d,m){function c(t){p[0].value=t,g.setHasValue(!d.$isEmpty(t))}function l(t){var a=moment(t,angular.isDate(t)?null:e.dateFormat,!0),i=a.format(e.dateFormat);a.isValid()?(c(i),d.$setViewValue(i)):(c(t),d.$setViewValue(t)),!d.$pristine&&f.hasClass("md-auto-hide")&&h.hasClass("md-input-invalid")&&f.removeClass("md-auto-hide"),d.$render()}function u(t){t.target.value!==d.$viewVaue&&l(t.target.value)}var p=angular.element(o[0].querySelector("input")),h=angular.element(o[0].querySelector("md-input-container")),g=h.controller("mdInputContainer");m(function(t){h.append(t)});var f=angular.element(h[0].querySelector("[ng-messages]"));e.type=e.dateFormat?"text":"date",e.dateFormat=e.dateFormat||"YYYY-MM-DD",e.model=d,e.isError=function(){return!d.$pristine&&!!d.$invalid},d.$formatters.unshift(function(t){var a=angular.isDate(t)&&moment(t);c(a&&a.isValid()?a.format(e.dateFormat):null)}),d.$validators.format=function(t,i){return a(i,e.dateFormat)},d.$validators.minDate=function(t,a){return i(a,e.dateFormat,e.minDate)},d.$validators.maxDate=function(t,a){return n(a,e.dateFormat,e.maxDate)},d.$validators.filter=function(t,a){return r(a,e.dateFormat,e.dateFilter)},d.$validators.required=function(t,e){return angular.isUndefined(s.required)||!d.$isEmpty(t)||!d.$isEmpty(e)},d.$parsers.unshift(function(t){var a=moment(t,e.dateFormat,!0);if(a.isValid()){if(angular.isDate(d.$modelValue)){var i=moment(d.$modelValue);i.year(a.year()),i.month(a.month()),i.date(a.date()),a=i}return a.toDate()}return null}),e.showPicker=function(a){t(d.$modelValue,{minDate:e.minDate,maxDate:e.maxDate,dateFilter:e.dateFilter,targetEvent:a}).then(l)},p.on("reset input blur",u),e.$on("$destroy",function(){p.off("reset input blur",u)})}}}}]),d.directive("mdpDatePicker",["$mdpDatePicker","$timeout",function(t,e){return{restrict:"A",require:"ngModel",scope:{minDate:"@min",maxDate:"@max",dateFilter:"=mdpDateFilter",dateFormat:"@mdpFormat"},link:function(e,o,s,d,m){function c(a){t(d.$modelValue,{minDate:e.minDate,maxDate:e.maxDate,dateFilter:e.dateFilter,targetEvent:a}).then(function(t){d.$setViewValue(moment(t).format(e.format)),d.$render()})}e.dateFormat=e.dateFormat||"YYYY-MM-DD",d.$validators.format=function(t,i){return a(i,e.format)},d.$validators.minDate=function(t,a){return i(a,e.format,e.minDate)},d.$validators.maxDate=function(t,a){return n(a,e.format,e.maxDate)},d.$validators.filter=function(t,a){return r(a,e.format,e.dateFilter)},o.on("click",c),e.$on("$destroy",function(){o.off("click",c)})}}}]),d.directive("mdpClock",["$animate","$timeout",function(t,e){return{restrict:"E",bindToController:{type:"@?",time:"=",autoSwitch:"=?"},replace:!0,template:'<div class="mdp-clock"><div class="mdp-clock-container"><md-toolbar class="mdp-clock-center md-primary"></md-toolbar><md-toolbar ng-style="clock.getPointerStyle()" class="mdp-pointer md-primary"><span class="mdp-clock-selected md-button md-raised md-primary"></span></md-toolbar><md-button ng-class="{ \'md-primary\': clock.selected == step }" class="md-icon-button md-raised mdp-clock-deg{{ ::(clock.STEP_DEG * ($index + 1)) }}" ng-repeat="step in clock.steps" ng-click="clock.setTime(step)">{{ step }}</md-button></div></div>',controller:["$scope",s],controllerAs:"clock",link:function(t,a,i,n){var r=(angular.element(a[0].querySelector(".mdp-pointer")),t.$parent.timepicker),o=function(t){var a=t.currentTarget.getClientRects()[0],i=t.currentTarget.offsetWidth/2-(t.pageX-a.left),o=t.pageY-a.top-t.currentTarget.offsetHeight/2,s=Math.round(Math.atan2(i,o)*(180/Math.PI));e(function(){n.setTimeByDeg(s+180),n.autoSwitch&&-1!==["mouseup","click"].indexOf(t.type)&&r&&r.switchView()})};a.on("mousedown",function(){a.on("mousemove",o)}),a.on("mouseup",function(t){a.off("mousemove")}),a.on("click",o),t.$on("$destroy",function(){a.off("click",o),a.off("mousemove",o)})}}}]),d.provider("$mdpTimePicker",function(){var t="OK",e="Cancel";this.setOKButtonLabel=function(e){t=e},this.setCancelButtonLabel=function(t){e=t},this.$get=["$mdDialog",function(a){var i=function(i,n){return angular.isDate(i)||(i=Date.now()),angular.isObject(n)||(n={}),a.show({controller:["$scope","$mdDialog","time","autoSwitch","$mdMedia",o],controllerAs:"timepicker",clickOutsideToClose:!0,template:'<md-dialog aria-label="" class="mdp-timepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }"><md-dialog-content layout-gt-xs="row" layout-wrap><md-toolbar layout-gt-xs="column" layout-xs="row" layout-align="center center" flex class="mdp-timepicker-time md-hue-1 md-primary"><div class="mdp-timepicker-selected-time"><span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_HOURS }" ng-click="timepicker.currentView = timepicker.VIEW_HOURS">{{ timepicker.time.format("h") }}</span>:<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_MINUTES }" ng-click="timepicker.currentView = timepicker.VIEW_MINUTES">{{ timepicker.time.format("mm") }}</span></div><div layout="column" class="mdp-timepicker-selected-ampm"><span ng-click="timepicker.setAM()" ng-class="{ \'active\': timepicker.time.hours() < 12 }">AM</span><span ng-click="timepicker.setPM()" ng-class="{ \'active\': timepicker.time.hours() >= 12 }">PM</span></div></md-toolbar><div><div class="mdp-clock-switch-container" ng-switch="timepicker.currentView" layout layout-align="center center"><mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" time="timepicker.time" type="hours" ng-switch-when="1"></mdp-clock><mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" time="timepicker.time" type="minutes" ng-switch-when="2"></mdp-clock></div><md-dialog-actions layout="row"><span flex></span><md-button ng-click="timepicker.cancel()" aria-label="'+e+'">'+e+'</md-button><md-button ng-click="timepicker.confirm()" class="md-primary" aria-label="'+t+'">'+t+"</md-button></md-dialog-actions></div></md-dialog-content></md-dialog>",targetEvent:n.targetEvent,locals:{time:i,autoSwitch:n.autoSwitch},skipHide:!0})};return i}]}),d.directive("mdpTimePicker",["$mdpTimePicker","$timeout",function(t,e){return{restrict:"E",require:"ngModel",transclude:!0,template:function(t,e){var a=angular.isDefined(e.mdpNoFloat),i=angular.isDefined(e.mdpPlaceholder)?e.mdpPlaceholder:"",n=angular.isDefined(e.mdpOpenOnClick)?!0:!1;return'<div layout layout-align="start start"><md-button class="md-icon-button" ng-click="showPicker($event)"'+(angular.isDefined(e.mdpDisabled)?' ng-disabled="disabled"':"")+'><md-icon md-svg-icon="mdp-access-time"></md-icon></md-button><md-input-container'+(a?" md-no-float":"")+' md-is-error="isError()"><input type="{{ ::type }}"'+(angular.isDefined(e.mdpDisabled)?' ng-disabled="disabled"':"")+' aria-label="'+i+'" placeholder="'+i+'"'+(n?' ng-click="showPicker($event)" ':"")+" /></md-input-container></div>"},scope:{timeFormat:"@mdpFormat",placeholder:"@mdpPlaceholder",autoSwitch:"=?mdpAutoSwitch",disabled:"=?mdpDisabled"},link:function(e,a,i,n,r){function o(t){m[0].value=t,l.setHasValue(!n.$isEmpty(t))}function s(t){var a=moment(t,angular.isDate(t)?null:e.timeFormat,!0),i=a.format(e.timeFormat);a.isValid()?(o(i),n.$setViewValue(i)):(o(t),n.$setViewValue(t)),!n.$pristine&&u.hasClass("md-auto-hide")&&c.hasClass("md-input-invalid")&&u.removeClass("md-auto-hide"),n.$render()}function d(t){t.target.value!==n.$viewVaue&&s(t.target.value)}var m=angular.element(a[0].querySelector("input")),c=angular.element(a[0].querySelector("md-input-container")),l=c.controller("mdInputContainer");r(function(t){c.append(t)});var u=angular.element(c[0].querySelector("[ng-messages]"));e.type=e.timeFormat?"text":"time",e.timeFormat=e.timeFormat||"HH:mm",e.autoSwitch=e.autoSwitch||!1,e.$watch(function(){return n.$error},function(t,e){l.setInvalid(!n.$pristine&&!!Object.keys(n.$error).length)},!0),n.$formatters.unshift(function(t){var a=angular.isDate(t)&&moment(t);o(a&&a.isValid()?a.format(e.timeFormat):null)}),n.$validators.format=function(t,a){return!a||angular.isDate(a)||moment(a,e.timeFormat,!0).isValid()},n.$validators.required=function(t,e){return angular.isUndefined(i.required)||!n.$isEmpty(t)||!n.$isEmpty(e)},n.$parsers.unshift(function(t){var a=moment(t,e.timeFormat,!0);if(a.isValid()){if(angular.isDate(n.$modelValue)){var i=moment(n.$modelValue);i.minutes(a.minutes()),i.hours(a.hours()),i.seconds(a.seconds()),a=i}return a.toDate()}return null}),e.showPicker=function(a){t(n.$modelValue,{targetEvent:a,autoSwitch:e.autoSwitch}).then(function(t){s(t,!0)})},m.on("reset input blur",d),e.$on("$destroy",function(){m.off("reset input blur",d)})}}}]),d.directive("mdpTimePicker",["$mdpTimePicker","$timeout",function(t,e){return{restrict:"A",require:"ngModel",scope:{timeFormat:"@mdpFormat",autoSwitch:"=?mdpAutoSwitch"},link:function(e,a,i,n,r){function o(a){t(n.$modelValue,{targetEvent:a,autoSwitch:e.autoSwitch}).then(function(t){n.$setViewValue(moment(t).format(e.format)),n.$render()})}e.format=e.format||"HH:mm",a.on("click",o),e.$on("$destroy",function(){a.off("click",o)})}}}])}();
//# sourceMappingURL=mdPickers.min.js.map

var registerApp = angular.module('appRegister', ['ngMaterial', 'ngRoute', 'ngResource', 'ngMessages', 'ngCookies', 'mdPickers']);
registerApp.config(function ($mdThemingProvider, $interpolateProvider) {
    $mdThemingProvider.definePalette('customTheme', customTheme);
    $mdThemingProvider.theme('default')
        .primaryPalette('customTheme');
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

var loginApp = angular.module('appLogin', ['ngMaterial', 'ngRoute', 'ngResource', 'ngMessages', 'ngCookies']);
loginApp.config(function ($mdThemingProvider, $interpolateProvider) {
    $mdThemingProvider.definePalette('customTheme', customTheme);
    $mdThemingProvider.theme('default')
        .primaryPalette('customTheme');
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

var welcomeApp = angular.module('appWelcome', ['ngMaterial', 'ngRoute', 'ngResource']);


var portalApp = angular.module('appTeacherDashboard', ['ngMaterial', 'ngRoute', 'ngResource', 'ngMessages', 'ngCookies', 'ngFileUpload', 'ngImgCrop', 'angularTrix', 'ngSanitize']);
portalApp.config(function ($mdThemingProvider, $interpolateProvider) {
    $mdThemingProvider.definePalette('customTheme', customTheme);
    $mdThemingProvider.theme('default')
        .primaryPalette('customTheme');
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

var customTheme = {
    '50': '3c092c',
    '100': '3c092c',
    '200': '3c092c',
    '300': '7F1369', //hue-1
    '400': '3c092c',
    '500': '2E4454', //toolbar
    '600': '3c092c',
    '700': '3c092c',
    '800': 'facd3e', //hue-2
    '900': '3c092c',
    'A100': '6737FF', //hue-3 and accent
    'A200': '6737FF',
    'A400': '6737FF',
    'A700': '6737FF',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'],
    'contrastLightColors': 'light'    // could also specify this if default was 'dark'
};
portalApp.factory('Data', function () {
    return {
        EventId: null,
        AddEventType: null,
        SelectedNotificationId: null,
        PostId: null,
        PersonId: null,
        PersonTable: null,
        SelectedMentor: null,
        SelectedLessonId: null,
        SelectedReservationId: null
    };
});

portalApp.service('ProfileService', function ($cookies, $http) {
        

    })
    .service('SectionService', function(){
        this.sections=[
            {name:'Announcement', url: 'svg/ic_announcement_white_48px.svg', access_level:'123'},
            {name:'Notification', url: 'svg/ic_notifications_white_48px.svg', access_level:'123'},
            {name:'Schedule', url: 'svg/ic_event_white_48px.svg', access_level:'123'},
            {name:'People', url: 'svg/ic_people_white_48px.svg', access_level:'123'},
            {name:'Mentor-schedule', url: 'svg/ic_event_note_white_48px.svg', access_level:'123'},
            {name:'Attendance', url: 'svg/ic_assessment_white_48px.svg', access_level:'3'},
            {name:'Settings', url: 'svg/ic_settings_white_48px.svg', access_level:'3'}
        ];
    })
    .service('PeopleService', function ($http) {
        var getPeople = function() {
            return $http({method:"GET", url:"php/getUsers.php"}).then(function(result){
                return result.data;
            });
        };
        return { getPeople: getPeople };
    })
portalApp.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})
    .filter('orderObjectBy', function(){
        return function(input, attribute) {
            if (!angular.isObject(input)) return input;

            var array = [];
            for(var objectKey in input) {
                array.push(input[objectKey]);
            }

            array.sort(function(a, b){
                a = parseInt(a[attribute]);
                b = parseInt(b[attribute]);
                return a - b;
            });
            return array;
        }
    });

portalApp.directive("dropzoneSyllabus", function(ProfileService) {
        return {
            restrict : "A",
            link: function (scope, elem) {
                elem.bind('dragover', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                elem.bind('dragenter', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    scope.$apply(function () {
                        scope.divClass = 'on-drag-enter';
                    });
                });
                elem.bind('dragleave', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    scope.$apply(function () {
                        scope.divClass = '';
                    });
                });
                elem.bind('drop', function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    var files = evt.dataTransfer.files;
                    for (var i = 0, f; f = files[i]; i++) {
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(f);

                        reader.onload = (function(theFile) {
                            return function(e) {
                                var newFile = { name : theFile.name,
                                    type : theFile.type,
                                    size : theFile.size,
                                    lastModifiedDate : theFile.lastModifiedDate
                                };
                                ProfileService.syllabuses.push(newFile);
                            };
                        })(f);
                    }
                });
            }
        }
    })
    .directive("dropzoneMaterial", function(ProfileService) {
        return {
            restrict : "A",
            link: function (scope, elem) {
                elem.bind('dragover', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                elem.bind('dragenter', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    scope.$apply(function () {
                        scope.divClass = 'on-drag-enter';
                    });
                });
                elem.bind('dragleave', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    scope.$apply(function () {
                        scope.divClass = '';
                    });
                });
                elem.bind('drop', function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    var files = evt.dataTransfer.files;
                    for (var i = 0, f; f = files[i]; i++) {
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(f);

                        reader.onload = (function(theFile) {
                            return function(e) {
                                var newFile = { name : theFile.name,
                                    type : theFile.type,
                                    size : theFile.size,
                                    lastModifiedDate : theFile.lastModifiedDate
                                };
                                ProfileService.materials.push(newFile);
                            };
                        })(f);
                    }
                });
            }
        }
    });

registerApp.controller('RegisterController', function ($scope) {
    $scope.user = {};
    var today = new Date();
    var today1 = moment(today);
    $scope.maxDate = today1.format('YYYY-MM-DD');

    $scope.birthDateFormatted = function () {
        return moment($scope.user.birthDate).format('MM-DD-YYYY')
    };
});

loginApp.controller('LoginController', function () {
});

portalApp.controller('MainMenuController', function ($scope, $rootScope, $cookies, $mdDialog, $mdMedia, $timeout, $mdSidenav, $http, $location, Data) {
    $scope.toggleNavBar = buildDelayedToggler('left');

    $scope.user_name = '';
    $scope.user_email = '';
    $scope.user_type = '';
    $scope.user_id = '';

    $rootScope.notification_count = 0;

    $http.get('/getUser').success(function (result) {
        $cookies.put('userId', result['id']);
        $cookies.put('userName', result['name']);
        $cookies.put('userEmail', result['email']);
        $cookies.put('userType', result['type']);
        $scope.$emit('setUserType', result['type']);
        $cookies.put('userProfileImage', result['profile_image_path']);
        if (result['type'] == 'student') {
            $cookies.put('userGroupId', result['group_id']);
        }

        $scope.user_name = $cookies.get('userName');
        $scope.user_email = $cookies.get('userEmail');
        $scope.user_type = $cookies.get('userType');
        $scope.user_id = $cookies.get('userId');
        $scope.user_profile_pic = $cookies.get('userProfileImage');

        if ($scope.user_type == 'student') {
            var user_group_id = $cookies.get('userGroupId');
            $http.get('/getNotificationsCount/groups/' + user_group_id).success(function (data) {
                $rootScope.notification_count += parseInt(data);
            });
            $http.get('/getNotificationsCount/students/' + $scope.user_id).success(function (data) {
                $rootScope.notification_count += parseInt(data);
            }).error(function (data) {
                console.log(data);
            });
        }
        else if ($scope.user_type == 'mentor') {
            $http.get('/getNotificationsCount/mentors/' + $scope.user_id).success(function (data) {
                $rootScope.notification_count += parseInt(data);
            });
        }
    });

    //get the css property of element
    function getStyle(elementId, property) {
        return document.defaultView.getComputedStyle(document.getElementById(elementId), '').getPropertyValue(property);
    }

    //hide drop down profile menu when lost focus
    $scope.hideDropDown = function () {
        setTimeout(function () {
            $('#dropDown').hide()
        }, 500);
    };

    //toggle drop down profile menu when profile image pressed
    $('#toggleDropDown').click(function () {
        var temp = $('#dropDown');
        temp.toggle();
        if (getStyle('dropDown', 'display') == 'block')
            temp.focus();
    });

    //initializing the display to show dialog in full screen mode
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

    /**
     * Show the image change pop-up menu
     */
    $scope.changeProfileImage = function () {
        Data.ChangeProfilePersonId = $scope.user_id;
        Data.ChangeProfilePersonTable = $scope.user_type + 's';

        $mdDialog.show({
            controller: changeProfilePictureController,
            templateUrl: 'dialogs/changeProfilePictureDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    /**
     * Open the edit profile dialog
     */
    $scope.editProfile = function () {
        Data.PersonTable = $scope.user_type + 's';
        Data.PersonId = $scope.user_id;

        $mdDialog.show({
            controller: personEditDialogController,
            templateUrl: 'dialogs/personEditDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function () {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    /**
     * Build handler to open/close a SideNav
     */
    function buildDelayedToggler(navID) {
        return debounce(function () {
            if ($mdSidenav(navID).isOpen()) {
                $mdSidenav(navID)
                    .close()
            } else {
                $mdSidenav(navID)
                    .open()
            }
        }, 100);
    }

    $scope.openNotification = function () {
        $location.path('/notification');
    }
})
    .controller('SectionListController', function ($scope, $location, $http, $cookies, $rootScope, Data, SectionService) {
        /*
         $http.get('/getSections').success(function (data) {
         $scope.sections = data;
         });
         */
        $scope.sections = SectionService.sections;

        $scope.$on('setUserType', function(event, args) {
            $scope.user_type = args;
        });

        $scope.user_access_level = function () {
            if ($scope.user_type === 'student')
                return 1;
            else if ($scope.user_type === 'mentor')
                return 2;
            else if ($scope.user_type === 'teacher')
                return 3;
        };

        $scope.selectSection = function (text) {
            $rootScope.current_section = text;
            $location.path('/' + text.toLowerCase());
        };

    })
    .controller('AnnouncementController', function ($scope, $rootScope, $mdDialog, $mdMedia, $mdToast, $http, $cookies, $route, Data) {
        $rootScope.current_section = 'Announcement';
        $scope.announcement_post = '';
        $scope.selected = [];
        $scope.user_type = $cookies.get('userType');
        $scope.user_id = $cookies.get('userId');

        //initialize loading
        $scope.loader = {
            loading: true,
            posting: false
        };

        $http.get('/getAnnouncements').success(function (data) {
            $scope.announcements = data[0];
            for (var i = 0; i < $scope.announcements.length; i++) {
                $scope.announcements[i].groups = data[1][i];
                $scope.announcements[i].owner = data[2][i];
            }
            $scope.loader.loading = false;
        });

        $http.get('/getGroups').success(function (data) {
            $scope.groups = data;
        });

        $scope.post = function () {
            $scope.user_id = $cookies.get('userId');
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/postAnnouncement',
                data: {
                    body: $scope.announcement_post,
                    owner_id: $scope.user_id,
                    group_list: $scope.selected
                }
            }).success(function () {
                $scope.announcement_post = '';
                $scope.selected = [];
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Posted'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.deletePost = function (index) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete announcement?')
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                $http({
                    method: 'POST',
                    url: '/deleteAnnouncement',
                    data: {id: $scope.announcements[index].id}
                }).success(function () {
                    $route.reload();
                    $mdToast.show($mdToast.simple().textContent('Deleted'));
                }).error(function (data) {
                    $mdToast.show($mdToast.simple().textContent('Error occurred'));
                    console.log(data);
                })
            });
        };

        $scope.editPost = function (index) {
            Data.PostId = $scope.announcements[index].id;
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: postEditDialogController,
                templateUrl: 'dialogs/editPostDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) list.splice(idx, 1);
            else list.push(item);
        };

        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

    })
    .controller('AttendanceController', function ($scope, $rootScope, $mdDialog, $mdMedia, $mdToast, $http, $cookies, $route, Data) {
        $rootScope.current_section = 'Attendance';

        $scope.loader = {
            loading: false,
            posting: false
        };

        $scope.students = [];
        $scope.groups = [];
        var date = new Date();
        $scope.momentDate = moment(date);
        $scope.show_list = [];
        $scope.attendances = [];

        $scope.showFormattedDate = function () {
            return $scope.momentDate.format('dddd, MMMM DD YYYY');
        };

        $scope.addDayToDate = function () {
            $scope.momentDate.add(1, 'd');
            updateDate();
        };

        $scope.subtractDayFromDate = function () {
            $scope.momentDate.subtract(1, 'd');
            updateDate();
        };

        $http.get('/getGroups').success(function (data) {
            $scope.groups = data;
            for (var i = 0; i < $scope.groups.length; i++) {
                $scope.show_list[i] = false;
            }
        });

        updateDate();

        function updateDate() {
            $scope.loader.loading = true;
            $http.get('/getStudentsWithAttendances/' + $scope.momentDate.format('YYYYMMDD')).success(function (data) {
                $scope.students = data;
                $scope.loader.loading = false;
            });
        }

        $scope.toggleList = function (index) {
            $scope.show_list[index] = !$scope.show_list[index];
        };

        $scope.searchEvent = function ($event) {
            $event.stopPropagation();
        };

        $scope.postAttendance = function () {
            $scope.loader.posting = true;

            for (var i = 0; i < $scope.students.length; i++) {
                $scope.attendances[i] = $scope.students[i].attendance;
                $scope.attendances[i].student_id = $scope.students[i].id;
                $scope.attendances[i].note = $scope.students[i].attendance.note;
                $scope.attendances[i].status = parseInt($scope.students[i].attendance.status);
            }

            $http({
                method: 'POST',
                url: '/postAttendance',
                data: {
                    date: $scope.momentDate.format('YYYYMMDD'),
                    attendances: $scope.attendances
                }
            }).success(function () {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('User type changed'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        }
    })
    .controller('PeopleController', function ($http, $scope, $rootScope, $cookies, $route, $mdDialog, $mdMedia, $mdToast, Data) {
        $rootScope.current_section = 'People';
        $scope.user_type = $cookies.get('userType');
        $scope.students = [];
        $scope.teachers = [];
        $scope.mentors = [];
        $scope.pending = [];
        $scope.groups = [];
        $scope.show_list = [];

        $scope.loader = {
            loading: false,
            posting: false
        };

        $scope.selected_group_id = null;

        if ($scope.user_type == 'teacher')
            $http.get('/getPending').success(function (data) {
                $scope.pending = data;
                $scope.loader.loading = false;
            });

        if ($scope.user_type != 'student') {
            $http.get('/getGroups').success(function (data) {
                $scope.groups = data;
                for (var i = 0; i < $scope.groups.length; i++) {
                    $scope.show_list[i] = true;
                }
            });
            $http.get('/getStudents').success(function (data) {
                $scope.students = data;
            });
        }

        $http.get('/getMentors').success(function (data) {
            $scope.mentors = data;
        });

        $http.get('/getTeachers').success(function (data) {
            $scope.teachers = data;
            $scope.loader.loading = false;
        });

        $scope.selectedIndex = 0;

        $scope.toggleList = function (index) {
            $scope.show_list[index] = !$scope.show_list[index];
        };

        $scope.searchEvent = function ($event) {
            $event.stopPropagation();
        };

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $scope.showContact = function (id, table) {
            Data.PersonId = id;
            Data.PersonTable = table;

            $mdDialog.show({
                controller: personSelectDialogController,
                templateUrl: 'dialogs/personSelectDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        $scope.changeType = function (id, type, selected_group_id) {
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/changeUserType',
                data: {
                    id: id,
                    type: type,
                    group_id: selected_group_id
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('User type changed'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.deleteUser = function (id) {
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/deleteUser',
                data: {
                    id: id
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('User deleted'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.sendEmail = function (id) {

        }
    })
    .controller('ScheduleController', function ($scope, $rootScope, $http, $location, $cookies, $mdDialog, $timeout, $mdMedia, Data) {
        $rootScope.current_section = 'Schedule';
        $scope.Data = Data;
        $scope.user_type = $cookies.get('userType');
        $scope.events = [];

        $scope.loader = {
            loading: false,
            posting: false
        };

        $scope.dt = new Date();

        $scope.isOpen = false;

        $http.get('/getMentors').success(function (data) {
            $scope.mentors = data;
        });

        $scope.today = function () {
            $scope.dt = new Date();
        };
        //Watch the selected date variable and fill out the remaining 6 days' events
        $scope.$watch('dt', function () {
            $scope.loader.loading = true;
            $http.get('/getWeekEvents/' + moment($scope.dt).format('YYYYMMDD') + '-'
                + moment($scope.dt).add(6, 'd').format('YYYYMMDD')).success(function (data) {
                $scope.events = [];

                angular.forEach(data, function (value1, key) {
                    angular.forEach(value1[0], function (value, key) {
                        var temp = value;
                        temp['type'] = value1['type'];
                        $scope.events.push(temp);
                    });
                });
                $scope.loader.loading = false;
            });

            $scope.temp1 = moment($scope.dt).add(1, 'd');
            $scope.temp2 = moment($scope.dt).add(2, 'd');
            $scope.temp3 = moment($scope.dt).add(3, 'd');
            $scope.temp4 = moment($scope.dt).add(4, 'd');
            $scope.temp5 = moment($scope.dt).add(5, 'd');
            $scope.temp6 = moment($scope.dt).add(6, 'd');
        });

        $scope.displayDate = function (elem) {
            return moment(elem).format("dddd, MMMM DD YYYY");
        };

        $scope.displayMoment = function (elem) {
            return elem.format("dddd, MMMM DD YYYY");
        };

        $scope.parseDateFormatted = function (date, type) {
            return moment(date, type).format('MM-DD-YYYY');
        };

        $scope.parseDate = function (date) {
            return moment(date).format('MM-DD-YYYY');
        };

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $scope.eventSelect = function (type, id) {
            if (type == 'lesson')
                $location.path('/lesson/' + id);
            else if (type == 'reservation') {
                Data.SelectedReservationId = id;

                $mdDialog.show({
                    controller: reservationSelectDialogController,
                    templateUrl: 'dialogs/reservationSelectDialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                });

                $scope.$watch(function () {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function (wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
                });
            }
        };

        $scope.eventAdd = function (type) {
            if (type == 'lesson')
                $location.path('/add-lesson');
            else if (type == 'reservation') {
                Data.SelectedMentor = [];
                $mdDialog.show({
                    controller: reservationAddDialogController,
                    templateUrl: 'dialogs/reservationAddDialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                });
                $scope.$watch(function () {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function (wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
                });
            }
        }
    })
    .controller('AssignmentsController', function ($scope, $rootScope, $mdDialog, $mdMedia, Data) {
        $rootScope.current_section = 'Assignment';
        $scope.assignments = [];
        $scope.status = false;

        $scope.showDeadlineFromNow = function (date) {
            return moment(date, "MM-DD-YYYY, HH:mm").fromNow()
        };
        $scope.showDeadline = function (date) {
            return moment(date, "MM-DD-YYYY, HH:mm").format("dddd, MMMM Do YYYY, HH:MM");
        };
        $scope.showStatus = function (bool) {
            if (bool)
                return "Done";
            else
                return "Now Done";
        };

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $scope.addAssignment = function () {
            $mdDialog.show({
                controller: assignmentAddDialogController,
                templateUrl: 'dialogs/assignmentAddDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }
    })
    .controller('GradingController', function ($rootScope) {
        $rootScope.current_section = 'Grading';
    })
    .controller('ConversationController', function ($rootScope) {
        $rootScope.current_section = 'Conversation';
    })
    .controller('NotificationController', function ($scope, $rootScope, $http, $cookies, $route, $mdDialog, $mdMedia, $mdToast, Data) {
        $rootScope.current_section = 'Notification';
        $scope.notifications = [[], []];

        $scope.loader = {
            loading: true,
            posting: false
        };

        $scope.user_type = $cookies.get('userType');
        var user_id = $cookies.get('userId');

        if ($scope.user_type == 'student') {
            var user_group_id = $cookies.get('userGroupId');
            $http.get('/getNotifications/groups/' + user_group_id).success(function (data) {
                $scope.notifications[0] = data;
            });
            $http.get('/getNotifications/students/' + user_id).success(function (data) {
                $scope.notifications[1] = data;
                $scope.loader.loading = false;
            });
        }
        else if ($scope.user_type == 'mentor') {
            $scope.notifications[0] = [];
            $http.get('/getNotifications/mentors/' + user_id).success(function (data) {
                $scope.notifications[1] = data;
                $scope.loader.loading = false;
            });
        }
        else {
            $scope.notifications[0] = [];
            $http.get('/getNotifications/teachers/' + 0).success(function (data) {
                $scope.notifications[1] = data;
                $scope.loader.loading = false;
            });
        }

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $scope.selectNotification = function (id, index, type) {
            if ($scope.notifications[type][index].status == 0)
                $http({
                    method: 'POST',
                    url: '/changeStatusNotification',
                    data: {id: id}
                }).success(function () {
                    $rootScope.notification_count -= 1;
                    if ($rootScope < 0) {
                        $rootScope = 0;
                    }
                    $scope.notifications[type][index].status = 1;
                    showSelectNotificationDialog(id);
                }).error(function (data) {
                    $mdToast.show($mdToast.simple().textContent('Error occurred'));
                    console.log(data);
                });
            else
                showSelectNotificationDialog(id);
        };

        function showSelectNotificationDialog(id) {
            Data.SelectedNotificationId = id;

            $mdDialog.show({
                controller: notificationSelectDialogController,
                templateUrl: 'dialogs/notificationSelectDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        $scope.showDateFromNow = function (date) {
            return moment(date, "YYYY-MM-DD HH:mm:ss").fromNow()
        };

        $scope.delete = function () {
            $scope.loader.posting = true;

            var list = [];

            $scope.notifications.forEach(function (notification_group) {
                notification_group.forEach(function (notification_elem) {
                    if (notification_elem.selected == true) {
                        list.push(notification_elem.id);
                    }
                })
            });

            $http({
                method: 'POST',
                url: '/deleteNotifications',
                data: {
                    list: list
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Notifications are deleted'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            });
        }
    })
    .controller('MentorScheduleController', function ($scope, $rootScope, $http, $mdDialog, $mdMedia, Data) {
        $rootScope.current_section = 'Mentor Schedule';

        $scope.metors = [];

        $scope.loader = {
            loading: true,
            posting: false
        };

        $http.get('/getMentors').success(function (data) {
            $scope.mentors = data;
            $scope.loader.loading = false;
        });

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $scope.eventAdd = function (index) {
            Data.AddEventType = 'extra';
            Data.SelectedMentor = $scope.mentors[index];

            $mdDialog.show({
                controller: reservationAddDialogController,
                templateUrl: 'dialogs/reservationAddDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }
    })
    .controller('SettingsController', function ($scope, $rootScope, $http, $route, $mdToast) {
        $rootScope.current_section = 'Settings';

        $scope.loader = {
            loading: true,
            posting: false
        };

        $scope.groups = [];
        $scope.places = [];

        $scope.button_disable = {
            group: false,
            place: false
        };

        $scope.addItem = {
            group: false,
            place: false
        };

        $scope.new_group = [];
        $scope.new_place = [];

        $http.get('/getPlaces').success(function (data) {
            $scope.places = data;

            $http.get('/getGroups').success(function (data) {
                $scope.groups = data;
                $scope.loader = false;
            });
        });

        $scope.toggleGroupItem = function () {
            $scope.addItem.group = !$scope.addItem.group;
            $scope.button_disable.group = !$scope.button_disable.group;
        };

        $scope.togglePlaceItem = function () {
            $scope.addItem.place = !$scope.addItem.place;
            $scope.button_disable.place = !$scope.button_disable.place;
        };

        $scope.createGroup = function () {
            $http({
                method: 'POST',
                url: '/createGroup',
                data: {
                    name: $scope.new_group.name,
                    email: $scope.new_group.email,
                    place_id: $scope.new_group.place_id
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('New group created'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.createPlace = function () {
            $http({
                method: 'POST',
                url: '/createPlace',
                data: {
                    name: $scope.new_place.name
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('New place created'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.deleteGroup = function (id) {
            $http({
                method: 'POST',
                url: '/deleteGroup',
                data: {
                    id: id
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Group deleted'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.deletePlace = function (id) {
            $http({
                method: 'POST',
                url: '/deletePlace',
                data: {
                    id: id
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Place deleted'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.editPlace = function () {
            $mdToast.show($mdToast.simple().textContent('In the next update'));
        };

        $scope.editGroup = function () {
            $mdToast.show($mdToast.simple().textContent('In the next update'));
        }

    })
    .controller('LessonController', function ($scope, $routeParams, $http, $sce) {
        var lesson_id = $routeParams.lessonId;
        $scope.lesson = [];

        $scope.loader = {
            loading: true,
            posting: false
        };

        $http.get('/getLesson/' + lesson_id).success(function (data) {
            $scope.lesson = data;
            $scope.loader.loading = false;
        });

        $scope.deliberatelyTrustDangerousSnippet = function () {
            return $sce.trustAsHtml($scope.lesson.body);
        };

        $scope.parsedDate = function () {
            return moment($scope.lesson.date, 'YYYYMMDD').format("dddd, MMMM DD YYYY")
        }
    })
    .controller('LessonEditorController', function ($scope, $rootScope, $cookies, $http, $location, Data, $mdDialog, $mdToast, $timeout, Upload) {
        $rootScope.current_section = "Lesson Editor";

        //progress circular initialization
        $scope.loader = {
            loading: false,
            posting: false
        };

        $scope.lesson = {};
        $scope.lesson.date = new Date();

        $scope.minDate = new Date();
        $scope.minDate.setDate((new Date()).getDate());

        $scope.startHour = '';
        $scope.startMinute = '';
        $scope.endHour = '';
        $scope.endMinute = '';

        //options to selectors
        $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {
            return {selectedHour: hour};
        });
        $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {
            return {selectedMinute: minute};
        });

        $scope.places = [];
        $http.get('/getPlaces').success(function (data) {
            $scope.places = data;
        });

        $scope.groups = [];
        $http.get('/getGroups').success(function (data) {
            $scope.groups = data;
        });

        //get the type of user to access some actions
        $scope.user_type = $cookies.get('userType');
        var user_id = $cookies.get('userId');

        $scope.addLesson = function () {
            $scope.loader.posting = true;

            var startTime = moment($scope.startHour + ':' + $scope.startMinute, 'HH:mm');
            var endTime = moment($scope.endHour + ':' + $scope.endMinute, 'HH:mm');

            checkTime();

            function checkTime() {
                if (startTime.isBefore(endTime)) {
                    postData();
                } else {
                    $mdToast.show($mdToast.simple().textContent('Invalid time input'));
                }
            }

            //data posting function
            function postData() {
                $http({
                    method: 'POST',
                    url: '/postLesson',
                    data: {
                        title: $scope.lesson.title,
                        body: $scope.lesson.body,
                        date: moment($scope.lesson.date).format("YYYYMMDD"),
                        start_time: startTime.format('HH:mm'),
                        end_time: endTime.format('HH:mm'),
                        group_id: $scope.lesson.group,
                        place_id: $scope.lesson.place,
                        status: 0,
                        teacher_id: user_id
                    }
                }).success(function () {
                    $location.path('/schedule');
                    $mdToast.show($mdToast.simple().textContent('Lesson added'));
                }).error(function (data) {
                    $scope.loader.posting = false;
                    $mdToast.show($mdToast.simple().textContent('Error occurred'));
                    console.log(data);
                })
            }
        };

        $scope.trixAttachmentAdd = function (e) {
            var attachment;
            attachment = e.attachment;
            if (attachment.file) {
                return upload(attachment);
            }
        };

        function upload(attachment) {
            Upload.upload({
                url: '/uploadFile',
                data: {
                    file: attachment.file
                }
            }).then(function (resp) {
                if (resp.status == 200) {
                    attachment.setAttributes({
                        url: resp.data.href,
                        href: resp.data.href
                    });
                    $mdToast.show($mdToast.simple().textContent('File uploaded'));
                }
                else {
                    $mdToast.show($mdToast.simple().textContent('Error occurred'));
                }
            }, null, function (evt) {
                var progress;
                progress = parseInt(100.0 * evt.loaded / evt.total);
                return attachment.setUploadProgress(progress);
            });
        }
    });
// Announcement edit dialog controller

function postEditDialogController($scope, $mdDialog, $http, $mdToast, Data, $route) {
    var announcement_id = Data.PostId;
    $scope.loader = {
        loading: true,
        posting: false
    };

    $scope.selected = [];

    $http.get('/getAnnouncement/' + announcement_id).success(function (data) {
        $scope.tempAnnouncement = data;
        $scope.tempAnnouncement.groups.forEach(function (group) {
            $scope.selected.push(group.id);
        });
        $scope.edited_post = $scope.tempAnnouncement.body;
        $scope.loader.loading = false;
    });

    $http.get('/getGroups').success(function (data) {
        $scope.groups = data;
    });

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.update = function () {
        $scope.loader.posting = true;
        $http({
            method: 'POST',
            url: '/updateAnnouncement',
            data: {
                id: announcement_id,
                body: $scope.edited_post,
                group_list: $scope.selected
            }
        }).success(function () {
            $mdDialog.hide();
            $route.reload();
            $mdToast.show($mdToast.simple().textContent('Post edited'));
        }).error(function (data) {
            $scope.loader.posting = false;
            $mdToast.show($mdToast.simple().textContent('Error occurred'));
            console.log(data);
        });
    };

    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
    };
    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };
}

// Schedule dialog controllers

function reservationSelectDialogController($scope, $http, $route, $cookies, $mdDialog, $mdMedia, $mdToast, Data) {
    //initialize loading
    $scope.loader = {
        loading: true,
        posting: false
    };
    var id = Data.SelectedReservationId;
    $scope.user_name = $cookies.get('userName');
    $scope.user_id = $cookies.get('userId');
    $scope.user_type = $cookies.get('userType');

    $scope.select_reservation = [];
    $scope.select_reservation_status = false;

    $scope.statusChangeCheck = function () {
        return false
    };
    $scope.checkOwner = function () {
        return false
    };

    $http.get('/getReservation/' + id).success(function (data) {
        $scope.loader.loading = false;
        $scope.select_reservation = data;
        $scope.select_reservation_status = $scope.select_reservation.status == 1;

        // to enable the switch to mark as 'done' if it's decided and user is the first responsible person
        $scope.statusChangeCheck = function () {
            return ($scope.select_reservation.status == 0
            && $scope.user_id == $scope.select_reservation.student_id
            && $scope.user_type == 'student');
        };

        // to display the delete and edit icon if user has an access to do actions
        $scope.checkOwner = function () {
            return ($scope.select_reservation.student_id == $scope.user_id && $scope.user_type == 'student') || $scope.user_type == 'teacher';
        };

    });

    $scope.onChange = function (cbState) {
        if (cbState)
            $scope.select_reservation.status = 1;
        else
            $scope.select_reservation.status = 0;
        $http({
            method: 'POST',
            url: '/changeStatusReservation',
            data: {
                id: id,
                status: $scope.select_reservation_status,
                from: $scope.user_type
            }
        }).success(function () {
            $mdToast.show($mdToast.simple().textContent('Event marked as ' + $scope.showStatus($scope.select_reservation.status)));
        }).error(function (data) {
            $mdToast.show($mdToast.simple().textContent('Error occurred'));
            console.log(data);
        });
    };

    $scope.showStatus = function (status) {
        switch (status) {
            case null:
                return 'Not decided';
                break;
            case '0':
                return 'Not Done';
                break;
            case 0:
                return 'Not Done';
                break;
            case '1':
                return 'Done';
                break;
            case 1:
                return 'Done';
                break;
            case 2:
                return 'Rejected';
                break;
            case '2':
                return 'Rejected';
                break;
            default:
                return 'Not Done';
                break;
        }
    };

    $scope.dateExtended = function (date) {
        return moment(date, 'YYYYMMDD').format("dddd, MMMM DD YYYY");
    };

    $scope.edit = function () {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            controller: reservationEditDialogController,
            templateUrl: 'dialogs/reservationEditDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };
    $scope.delete = function () {
        var confirm = $mdDialog.confirm()
            .title('Are you sure to delete event?')
            .ok('Delete')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            $http({
                method: 'POST',
                url: '/deleteReservation',
                data: {
                    id: id
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Reservation deleted'));
            }).error(function (data) {
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            });
        });
    };
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

function reservationEditDialogController($scope, $http, $route, $cookies, $mdDialog, $timeout, $q, $mdToast, Data) {
    //initializing progress loading
    $scope.loader = {
        loading: true,
        posting: false
    };
    var id = Data.SelectedReservationId;
    var user_type = $cookies.get('userType');
    $scope.edit_reservation = null;

    var startTime = [];
    var endTime = [];

    $scope.checkStudent = function () {
        return user_type == 'student';
    };

    $http.get('/getReservation/' + id).success(function (data) {
        $scope.edit_reservation = data;
        $scope.edit_reservation.date = new Date(moment($scope.edit_reservation.date, 'YYYYMMDD'));

        startTime = $scope.edit_reservation.start_time.split(':');
        endTime = $scope.edit_reservation.end_time.split(':');

        $scope.startHour = startTime[0];
        $scope.startMinute = startTime[1];
        $scope.endHour = endTime[0];
        $scope.endMinute = endTime[1];

        $scope.selectedResponsible1 = null;
        $scope.selectedResponsible2 = null;

        $http.get('/getMentors').success(function (data) {
            $scope.searchResponsiblePeople2 = loadAll(data);
            for (key in $scope.searchResponsiblePeople2) {
                if ($scope.searchResponsiblePeople2[key].id == $scope.edit_reservation.mentor_id) {
                    $scope.selectedResponsible2 = $scope.searchResponsiblePeople2[key];
                }
            }
        });
        $scope.loader.loading = false;
    });

    $scope.places = [];
    $http.get('/getPlaces').success(function (data) {
        $scope.places = data;
    });

    $scope.querySearch = querySearch;

    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {
        return {selectedHour: hour};
    });
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {
        return {selectedMinute: minute};
    });

    function querySearch(query, people) {
        var results = query ? people.filter(createFilterFor(query)) : people, deferred;
        deferred = $q.defer();
        $timeout(function () {
            deferred.resolve(results);
        }, Math.random() * 1000, false);
        return deferred.promise;
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(person) {
            return (person.value.indexOf(lowercaseQuery) === 0);
        };
    }

    function loadAll(people) {
        for (key in people) {
            people[key].value = (people[key].name).toLowerCase();
        }
        return people;
    }

    $scope.submit = function () {
        var startTime = moment($scope.startHour + ':' + $scope.startMinute, 'HH:mm');
        var endTime = moment($scope.endHour + ':' + $scope.endMinute, 'HH:mm');

        if (user_type == 'student') {
            $scope.edit_reservation.status = null;
        }

        if (startTime.isBefore(endTime)) {
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/updateReservation',
                data: {
                    id: $scope.edit_reservation.id,
                    title: $scope.edit_reservation.title,
                    description: $scope.edit_reservation.description,
                    date: moment($scope.edit_reservation.date).format("YYYYMMDD"),
                    start_time: startTime.format('HH:mm'),
                    end_time: endTime.format('HH:mm'),
                    place_id: $scope.edit_reservation.place_id,
                    status: $scope.edit_reservation.status,
                    mentor_id: $scope.selectedResponsible2.id
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Reservation updated'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        } else {
            $mdToast.show($mdToast.simple().textContent('Invalid time input'));
        }
    };
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

function reservationAddDialogController($scope, $http, $cookies, $route, $mdDialog, $timeout, $q, $mdToast, Data) {
    $scope.loader = {
        posting: false
    };
    var user_id = $cookies.get('userId');
    $scope.user_type = $cookies.get('userType');

    $scope.minDate = new Date();
    $scope.minDate.setDate((new Date()).getDate());

    $scope.eventDescription = '';
    $scope.eventPlace = '';
    $scope.eventStatus = null;
    $scope.eventResponsible1 = [];
    $scope.eventResponsible2 = Data.SelectedMentor;
    $scope.eventDate = new Date();

    $scope.startHour = '';
    $scope.startMinute = '';
    $scope.endHour = '';
    $scope.endMinute = '';

    $scope.places = [];
    $http.get('/getPlaces').success(function (data) {
        $scope.places = data;
    });

    if ($scope.user_type != 'student')
        $http.get('/getStudents').success(function (data) {
            $scope.searchResponsiblePeople1 = loadAll(data);
        });

    $http.get('/getMentors').success(function (data) {
        $scope.searchResponsiblePeople2 = loadAll(data);
    });

    $scope.querySearch = querySearch;
    $scope.selectedResponsible1 = $scope.eventResponsible1;
    $scope.selectedResponsible2 = $scope.eventResponsible2;

    //options to selectors
    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {
        return {selectedHour: hour};
    });
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {
        return {selectedMinute: minute};
    });

    function querySearch(query, people) {
        var results = query ? people.filter(createFilterFor(query)) : people, deferred;
        deferred = $q.defer();
        $timeout(function () {
            deferred.resolve(results);
        }, Math.random() * 1000, false);
        return deferred.promise;
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(person) {
            return (person.value.indexOf(lowercaseQuery) === 0);
        };
    }

    function loadAll(people) {
        for (var key in people) {
            people[key].value = (people[key].name).toLowerCase();
        }
        return people;
    }

    $scope.submit = function () {
        var startTime = moment($scope.startHour + ':' + $scope.startMinute, 'HH:mm');
        var endTime = moment($scope.endHour + ':' + $scope.endMinute, 'HH:mm');

        console.log($scope.selectedResponsible1);
        if ($scope.user_type == 'teacher')
            $scope.eventStatus = 0;
        else if ($scope.user_type == 'student') {
            $scope.selectedResponsible1.id = user_id;
        }

        if (startTime.isBefore(endTime)) {
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/addReservation',
                data: {
                    description: $scope.eventDescription,
                    date: moment($scope.eventDate).format("YYYYMMDD"),
                    start_time: startTime.format('HH:mm'),
                    end_time: endTime.format('HH:mm'),
                    place_id: $scope.eventPlace,
                    status: $scope.eventStatus,
                    student_id: $scope.selectedResponsible1.id,
                    mentor_id: $scope.selectedResponsible2.id
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Reservation added'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        } else {
            $mdToast.show($mdToast.simple().textContent('Invalid time input'));
        }
    };
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

// Notification dialog controllers

function notificationSelectDialogController($scope, $route, $http, $cookies, $mdDialog, $mdToast, Data) {
    $scope.loader = {
        loading: true,
        posting: false
    };

    $scope.user_id = $cookies.get('userId');
    $scope.user_type = $cookies.get('userType');
    $scope.notification_data = [];
    $scope.notification_data.status = null;

    $scope.editMode = false;

    var notification_id = Data.SelectedNotificationId;

    $http.get('/getNotification/' + notification_id).success(function (data) {
        $scope.loader.loading = false;

        $scope.notification_data = data;

        if ($scope.notification_data.type == 'announcement') {
            $scope.notificationDate = $scope.notification_data.updated_at;
            $scope.notificationTitle = 'Announcement';
            $scope.notificationContent = $scope.notification_data.body;
            $scope.notificationOwner = $scope.notification_data.owner.name;
            $scope.notificationOwnerId = $scope.notification_data.owner.id;
        }
        else if ($scope.notification_data.type == 'reservation') {
            $scope.notificationTitle = 'Mentor reservation';

            $scope.notificationDate = $scope.notification_data.date;
            $scope.notificationContent = $scope.notification_data.description;
            //for teacher case
            if ($scope.notification_data.receiver.length == 0)
                $scope.notificationReceiverId = 0;
            else
                $scope.notificationReceiverId = $scope.notification_data.receiver.id;
            $scope.notificationReceiverType = $scope.notification_data.receiver_type;

            var startTime = $scope.notification_data.start_time.split(':');
            var endTime = $scope.notification_data.end_time.split(':');

            $scope.startHour = startTime[0];
            $scope.startMinute = startTime[1];
            $scope.endHour = endTime[0];
            $scope.endMinute = endTime[1];
        }

        //edit icon checker
        $scope.edit_check = (
        !$scope.editMode
        && $scope.notification_data.status == null
        && $scope.notificationReceiverType == $scope.user_type
        && $scope.notificationReceiverId == $scope.user_id);

    }).error(function (data) {
        $mdToast.show($mdToast.simple().textContent('Error loading notification data'));
        $mdDialog.hide();
        $route.reload();
        console.log(data);
    });

    $scope.reservationRespondCheck = function () {
        return !$scope.editMode
            && $scope.notification_data.status == null
            && $scope.notification_data.type == 'reservation'
            && $scope.user_type != 'teacher'
    };

    $scope.showStatus = function (check) {
        if (check == null)
            return 'Not decided yet';
        else if (check == 0)
            return 'Decided';
        else if (check == 2)
            return 'Rejected';
        else if (check == 1)
            return 'Done';
    };

    $scope.reservationAccept = function (bool) {
        $scope.loader.posting = true;
        if (bool) {
            $http({
                method: 'POST',
                url: '/changeStatusReservation',
                data: {
                    id: $scope.notification_data.id,
                    status: 0,
                    from: $scope.user_type
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Extra lesson request accepted'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            });
        } else {
            $http({
                method: 'POST',
                url: '/changeStatusReservation',
                data: {
                    id: $scope.notification_data.id,
                    status: 2,
                    from: $scope.user_type
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Reservation rejected'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            });
        }
    };

    $scope.edit = function () {
        $scope.editMode = true;
    };

    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {
        return {selectedHour: hour};
    });
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {
        return {selectedMinute: minute};
    });

    $scope.dateExtended = function (date) {
        return moment(date, 'YYYYMMDD').format("dddd, MMMM DD YYYY");
    };

    $scope.update = function () {
        var startTime = moment($scope.startHour + ':' + $scope.startMinute, 'HH:mm');
        var endTime = moment($scope.endHour + ':' + $scope.endMinute, 'HH:mm');

        if (startTime.isBefore(endTime)) {
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/changeTimeReservation',
                data: {
                    id: $scope.notification_data.id,
                    startTime: startTime.format('HH:mm'),
                    endTime: endTime.format('HH:mm'),
                    from: $scope.user_type
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Reservation time changed changed'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            });
        } else {
            $mdToast.show($mdToast.simple().textContent('Invalid time input'));
        }
    };
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

//Person select dialog controller

function personSelectDialogController($scope, $http, $cookies, $mdDialog, $mdMedia, Data) {
    //initializing variables
    $scope.person_data = [];
    $scope.loader = {
        loading: true
    };
    //get the selected person data from factory
    $scope.person_table = Data.PersonTable;
    $scope.person_id = Data.PersonId;
    //get the user's data from cookie
    var user_type = $cookies.get('userType');
    var user_id = $cookies.get('userId');

    //get the data of selected person from server
    $http.get('/getDataUser/' + $scope.person_table + '/' + $scope.person_id).success(function (data) {
        $scope.person_data = data;
        $scope.loader.loading = false;
    });

    //check the user has access to edit personal data
    $scope.checkOwner = function () {
        return (user_type == 'teacher' || (user_id == $scope.person_id && (user_type + 's') == $scope.person_table)) && $scope.person_table != 'users';
    };

    //convert the birth date to readable format
    $scope.displayBirthDate = function () {
        return moment($scope.person_data.birthDate, 'MM-DD-YYYY').format('D MMMM YYYY')
    };

    //initializing the display to show dialog in full screnn mode
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

    //call the edit personal data dialog
    $scope.edit = function () {
        $mdDialog.show({
            controller: personEditDialogController,
            templateUrl: 'dialogs/personEditDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    //help functions
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

function personEditDialogController($scope, $http, $cookies, $mdMedia, $mdDialog, $mdToast, $route, Data) {
    //progress circular initialization
    $scope.loader = {
        loading: true,
        posting: false
    };
    //get the type of user to access some actions
    $scope.user_type = $cookies.get('userType');
    $scope.user_id = $cookies.get('userId');

    //get the edited person data from factory
    $scope.edited_person_id = Data.PersonId;
    $scope.edited_person_table = Data.PersonTable;

    //get the type of user to access some actions
    $scope.user_type = $cookies.get('userType');

    //get the work days and hours for teachers and mentors
    $scope.selected_days = [];
    $scope.startHour = null;
    $scope.startMinute = null;
    $scope.endHour = null;
    $scope.endMinute = null;
    $scope.old_password = '';
    $scope.new_password = '';
    $scope.new_password_confirm = '';

    //model for week days list
    $scope.week_days = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

    //options to selectors
    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {
        return {selectedHour: hour};
    });
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {
        return {selectedMinute: minute};
    });

    //get the list of groups
    $scope.groups = [];
    $http.get('/getGroups').success(function (data) {
        $scope.groups = data;
    });

    //get the edited person's data from server
    $http.get('/getDataUser/' + $scope.edited_person_table + '/' + $scope.edited_person_id).success(function (data) {
        $scope.edited_person_data = data;
        if ($scope.edited_person_data.work_days) {
            $scope.selected_days = $scope.edited_person_data.work_days.split(',');

            var startTime = $scope.edited_person_data.work_start_time.split(':');
            var endTime = $scope.edited_person_data.work_end_time.split(':');

            $scope.startHour = startTime[0];
            $scope.startMinute = startTime[1];
            $scope.endHour = endTime[0];
            $scope.endMinute = endTime[1];
        }
        $scope.loader.loading = false;
    });

    //convert the birth date to readable format
    $scope.displayBirthDate = function (date) {
        return moment(date, 'MM-DD-YYYY').format('D MMMM YYYY')
    };

    //initializing the display to show dialog in full screen mode
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

    //change profile picture
    $scope.changeProfileImage = function () {
        if ($scope.checkOwner()) {
            $mdDialog.show({
                controller: changeProfilePictureController,
                templateUrl: 'dialogs/changeProfilePictureDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }
    };

    //check the owner of data
    $scope.checkOwner = function () {
        return $scope.user_id == $scope.edited_person_id &&
            $scope.user_type + 's' == $scope.edited_person_table;
    };

    //update the personal info
    $scope.update = function () {
        var startTime = moment($scope.startHour + ':' + $scope.startMinute, 'HH:mm');
        var endTime = moment($scope.endHour + ':' + $scope.endMinute, 'HH:mm');

        if ($scope.old_password.length != 0) {
            if ($scope.new_password == $scope.new_password_confirm) {
                if ($scope.new_password.length <= 8)
                    $mdToast.show($mdToast.simple().textContent('Password should be at least 8 character!'));
                else
                    checkTime();
            } else {
                $mdToast.show($mdToast.simple().textContent('Passwords don\'t match'));
            }
        } else
            checkTime();

        function checkTime() {
            if ($scope.edited_person_table != 'students' && $scope.edited_person_table != 'users') {
                if (startTime.isBefore(endTime)) {
                    postData();
                } else {
                    $mdToast.show($mdToast.simple().textContent('Invalid time input'));
                }
            } else
                postData();
        }

        //data posting function
        function postData() {
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/updateUser',
                data: {
                    table: $scope.edited_person_table,
                    id: $scope.edited_person_id,
                    name: $scope.edited_person_data.name,
                    email: $scope.edited_person_data.email,
                    old_pass: $scope.old_password,
                    new_pass: $scope.new_password,
                    phone: $scope.edited_person_data.phone,
                    birthDate: $scope.edited_person_data.birthDate,
                    group_id: $scope.edited_person_data.group_id,
                    work_days: $scope.selected_days.join(','),
                    work_start_time: startTime.format('HH:mm'),
                    work_end_time: endTime.format('HH:mm'),
                    bio: $scope.edited_person_data.bio
                }
            }).success(function (data) {
                if (data == 2) {
                    $scope.loader.posting = false;
                    $mdToast.show($mdToast.simple().textContent('Old password doesn\'t match!'));
                } else {
                    $mdDialog.hide();
                    $route.reload();
                    $mdToast.show($mdToast.simple().textContent('Personal data updated'));
                }
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        }
    };

    //help functions
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

}

//Profile picture edit controller

function changeProfilePictureController($scope, $cookies, $mdDialog, $mdToast, $timeout, Upload) {
    //progress circular initialization
    $scope.loader = {
        loading: false,
        posting: false
    };

    //get the type of user to access some actions
    var user_type = $cookies.get('userType');
    var user_id = $cookies.get('userId');

    //upload the cropped image to server
    $scope.upload = function (dataUrl, name) {
        $scope.loader.posting = true;
        Upload.upload({
            url: '/uploadImage',
            data: {
                user_type: user_type,
                user_id: user_id,
                file: Upload.dataUrltoBlob(dataUrl, name)
            }
        }).then(function (resp) {
            $timeout(function () {
                $scope.loader.posting = false;
                if (resp.status == 200) {
                    $mdDialog.hide();
                    location.reload();
                    $mdToast.show($mdToast.simple().textContent('Picture uploaded'));
                }
                else {
                    $mdToast.show($mdToast.simple().textContent('Error occurred'));
                }
            });
        }, null, null);
    };

    //help functions
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

// Assignment add dialog controller

function assignmentAddDialogController($scope, $mdDialog, $mdToast) {
    /*
     $scope.minDate = new Date();
     $scope.minDate.setDate((new Date()).getDate());

     $scope.assignmentTitle = '';
     $scope.assignmentRule = '';
     $scope.assignmentGroup = '';


     $scope.assignmentStartDate = '';
     $scope.assignmentEndDate = '';

     $scope.startHour = '';
     $scope.startMinute = '';
     $scope.endHour = '';
     $scope.endMinute = '';

     //options to selectors
     $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {
     return {selectedHour: hour};
     });
     $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {
     return {selectedMinute: minute};
     });


     $scope.submit = function () {
     $scope.addedAssignment = {};

     var startDate = moment(moment($scope.assignmentStartDate).format('MM-DD-YYYY') + ',' + $scope.startHour + ':' + $scope.startMinute, 'MM-DD-YYYY,HH:mm');
     var endDate = moment(moment($scope.assignmentEndDate).format('MM-DD-YYYY') + ',' + $scope.endHour + ':' + $scope.endMinute, 'MM-DD-YYYY,HH:mm');

     if (startDate.isBefore(endDate)) {
     $scope.addedAssignment.title = $scope.assignmentTitle;
     $scope.addedAssignment.rule = $scope.assignmentRule;
     $scope.addedAssignment.date = moment(new Date).format("MM-DD-YYYY, HH:mm");
     $scope.addedAssignment.startDate = startDate.format('MM-DD-YYYY, HH:mm');
     $scope.addedAssignment.endDate = endDate.format('MM-DD-YYYY, HH:mm');
     $scope.addedAssignment.owner = ProfileService.user_name;
     $scope.addedAssignment.doneCount = 0;

     $mdDialog.hide();
     $mdToast.show($mdToast.simple().textContent('Assignment Added'));
     } else {
     $mdToast.show($mdToast.simple().textContent('Invalid time input'));
     }

     };
     $scope.hide = function () {
     $mdDialog.hide();
     };
     $scope.cancel = function () {
     $mdDialog.cancel();
     };
     */
}

//useful functions
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
}
portalApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: "sections/Schedule.html",
            controller: 'ScheduleController'
        })
        .when('/announcement', {
            templateUrl: "sections/Announcement.html",
            controller: 'AnnouncementController'
        })
        .when('/conversation', {
            templateUrl: "sections/Conversation.html",
            controller: 'ConversationController'
        })
        .when('/notification', {
            templateUrl: "sections/Notification.html",
            controller: 'NotificationController'
        })
        .when('/people', {
            templateUrl: "sections/People.html",
            controller: 'PeopleController'
        })
        .when('/schedule', {
            templateUrl: "sections/Schedule.html",
            controller: 'ScheduleController'
        })
        .when('/mentor-schedule', {
            templateUrl: "sections/MentorSchedule.html",
            controller: 'MentorScheduleController'
        })
        .when('/assignment', {
            templateUrl: "sections/Assignments.html",
            controller: 'AssignmentsController'
        })
        .when('/grading', {
            templateUrl: "sections/Grading.html",
            controller: 'GradingController'
        })
        .when('/add-lesson', {
            templateUrl: "sections/Lesson-Editor.html",
            controller: 'LessonEditorController'
        })
        .when('/lesson-editor/:lessonId', {
            templateUrl: "sections/Lesson-Editor.html",
            controller: 'LessonEditorController'
        })
        .when('/lesson/:lessonId', {
            templateUrl: "sections/Lesson.html",
            controller: 'LessonController'
        })
        .when('/attendance',{
            templateUrl: "sections/Attendance.html",
            controller: 'AttendanceController'
        })
        .when('/settings', {
            templateUrl: "sections/Settings.html",
            controller: 'SettingsController'
        })
        .when('/grading', {
            templateUrl: "sections/Grading.html",
            controller: 'GradingController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

//# sourceMappingURL=all.js.map
