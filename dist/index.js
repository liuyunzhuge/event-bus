const isArray = some => Object.prototype.toString.call(some) == '[object Array]'
const slice = Array.prototype.slice

function formatEvent(event) {
    event = event.split('.')
    return { name: event, namespaceList: event.slice(1) }
}

function normalizeEvents(events) {
    if (!isArray(events)) {
        events = [events]
    }

    for (let [i, event] of events.entries()) {
        events[i] = formatEvent(event)
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

class EventCenter {

    /**
     * Map is more convenient than Object
     */
    entries = new Map()

    /**
     * @param {String|Array} events
     * @param {Function} callback
     * @return {EventCenter}
     * 
     * register events and its callbacks
     */
    on(events, callback, once = false) {
        events = normalizeEvents(events)

        for (let event of events) {
            let entry = findEntryOrCreate(this.entries, event.name)
            entry.addCallback(callback, event.namespaceList, once)
        }

        return this
    }

    /**
     * @param {String|Array} events
     * @param {Function} callback
     * @return {EventCenter}
     * 
     * remove events and its callbacks
     */
    off(events, callback) {
        if (!events) return this.entries.clear()

        events = normalizeEvents(events)
        for (let event of events) {
            let entry = findEntry(this.entries, event.name)
            if (entry) {
                entry.removeCallback(callback)
            }
        }

        return this
    }

    /**
     * @param {String|Array} events
     * @param {Function} callback
     * @return {EventCenter}
     * 
     * register events and its callbacks just once
     */
    once(events, callback) {
        this.on(events, callback, true)
    }

    /**
     * @param {String} event 
     * 
     * dispatch event
     */
    trigger(event, ...data) {
        event = formatEvent(event)
        let entry = findEntry(this.entries, event.name)
        if (entry) {
            entry.fire(...data)
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

    addCallback(callback, namespaceList, once = false) {
        this.listeners.push(new EventListener(callback, namespaceList, once))
    }

    removeCallback(callback) {
        let removeAll = callback === undefined

        for (let i = this.listeners.length - 1; i >= 0; i--) {
            if (this.listeners[i].callback === callback || removeAll) {
                this.listeners.splice(i, 1)
            }
        }
    }

    fire(...data) {
        let toBeRemoved = []

        this.listeners.forEach((listener, index) => {
            listener.callback(...data)

            if (listener.once) {
                toBeRemoved.push(index)
            }
        })

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
    _namespaceMatcher

    constructor(_callback, _namespaceList, _once) {
        this._callback = _callback
        this._once = _once
        if (_namespaceList.length) {
            this._namespaceMatcher = new RegExp('(' + _namespaceList.map(ns => '\.' + ns).join('|') + ')')
        }
    }

    checkNamespaceMatch(namespaceString) {
        if (!this._namespaceMatcher) return false
        let results = namespaceString.match(this._namespaceMatcher)
        if (namespaceString.match(this._namespaceMatcher)) {

        }
    }

    get callback() {
        return this._callback
    }

    get once() {
        return this._once
    }
}