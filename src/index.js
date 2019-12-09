const isArray = some => Object.prototype.toString.call(some) == '[object Array]'
const isString = some => Object.prototype.toString.call(some) == '[object String]'

function parseEvent(event) {
    event = event.split('.')
    return { name: event[0], namespaceList: event.slice(1).sort() }
}

function getNamespaceMatcher(namespaceList) {
    return new RegExp("(^|\\.)" + namespaceList.join("\\.(?:.*\\.|)") + "(\\.|$)");
}

function normalizeEvents(events) {
    if (!isArray(events)) {
        events = [isString(isString) ? events : String(events)]
    }

    for (let [i, event] of events.entries()) {
        events[i] = parseEvent(event)
    }

    return events
}

function findEntryOrCreate(entries, name) {
    let target = null
    if (entries.has(name)) {
        target = entries.get(name)
    } else {
        target = new EventEntry(name)
        entries.set(name, target)
    }

    return target
}

function findEntry(entries, name) {
    if (entries.has(name)) {
        return entries.get(name)
    }

    return null
}

class EventBus {

    /**
     * Map is more convenient than Object
     */
    entries = new Map();

    /**
     * @param {String|Array} events
     * @param {Function} callback
     * @return {EventBus}
     * 
     * register events and its callbacks
     */
    on(events, callback, once = false) {
        if(!events) return

        events = normalizeEvents(events)

        for (let event of events) {
            let entry = findEntryOrCreate(this.entries, event.name)
            entry.addCallback(event.namespaceList, callback, once)
        }

        return this
    }

    /**
     * @param {String|Array} events
     * @param {Function} callback
     * @return {EventBus}
     * 
     * register events and its callbacks just once
     */
    once(events, callback) {
        this.on(events, callback, true)
    }

    /**
     * @param {String|Array} events
     * @param {Function} callback
     * @return {EventBus}
     * 
     * remove events and its callbacks
     */
    off(...args) {
        let events, callback
        if (args.length === 1) {
            events = args[0]
        } else if (args.length == 2) {
            events = args[0]
            callback = args[1]
        }

        if(!events) {
            return this.entries.clear()
        }

        events = normalizeEvents(events)
        for (let event of events) {
            let entry = findEntry(this.entries, event.name)
            if (entry) {
                entry.removeCallback(event.namespaceList, callback)
            }
        }

        return this
    }

    /**
     * @param {String} event 
     * 
     * dispatch event
     */
    trigger(event, ...data) {
        if(!event) return

        event = parseEvent(event)
        let entry = findEntry(this.entries, event.name)
        if (entry) {
            entry.fire(event.namespaceList, ...data)
        }

        return this
    }
}

class EventEntry {
    _listeners
    _name

    constructor(name) {
        this._name = name;
    }

    get listeners() {
        if (this._listeners === undefined) {
            this._listeners = []
        }

        return this._listeners
    }

    get name() {
        return this._name
    }

    addCallback(namespaceList, callback, once = false) {
        this.listeners.push(new EventListener(callback, namespaceList.join('.'), once))
    }

    removeCallback(namespaceList, callback) {
        let matcher = namespaceList.length && getNamespaceMatcher(namespaceList)

        for (let i = this.listeners.length - 1; i >= 0; i--) {
            if (!matcher || matcher.test(this.listeners[i].namespaces)) {
                if (!callback || this.listeners[i].callback === callback) {
                    this.listeners.splice(i, 1)
                }
            }
        }
    }

    fire(namespaceList, ...data) {
        let toBeRemoved = []

        let matcher = namespaceList.length && getNamespaceMatcher(namespaceList)

        this.listeners.forEach((listener, index) => {
            if (!matcher || matcher.test(listener.namespaces)) {
                listener.callback(...data)

                if (listener.once) {
                    toBeRemoved.push(index)
                }
            }
        })

        if (!toBeRemoved.length) return
        let hasRemoved = 0
        for (let index of toBeRemoved) {
            this.listeners.splice(index - hasRemoved, 1)
            hasRemoved += 1
        }
    }
}

class EventListener {
    _callback
    _once
    _namespaces

    constructor(_callback, _namespaces, _once) {
        this._callback = _callback
        this._once = _once
        this._namespaces = _namespaces
    }

    get callback() {
        return this._callback
    }

    get once() {
        return this._once
    }

    get namespaces() {
        return this._namespaces
    }
}

export default EventBus