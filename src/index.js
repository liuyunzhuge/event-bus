// @flow

const isArray = (some: ?any): boolean => Object.prototype.toString.call(some) == '[object Array]'
const isString = (some: ?any): boolean => Object.prototype.toString.call(some) == '[object String]'

type ParsedEvent = { name: ?string, namespaceList: Array<string> }

function parseEvent(event: string): ParsedEvent {
    const events: Array<string> = event.split('.')
    return { name: event[0], namespaceList: events.slice(1).sort() }
}

function getNamespaceMatcher(namespaceList: Array<string>): RegExp {
    return new RegExp("(^|\\.)" + namespaceList.join("\\.(?:.*\\.|)") + "(\\.|$)");
}

function normalizeEvents(events: Array<string> | string): Array<ParsedEvent> {
    let _events: Array<string>
    let normalized: Array<ParsedEvent> = []
    if (typeof events === 'string') {
        _events = [isString(isString) ? events : String(events)]
    } else {
        _events = events
    }

    _events.forEach((event: string) => {
        normalized.push(parseEvent(event))
    })

    return normalized
}

function findEntryOrCreate(entries: Dictionary<EventEntry>, name: string): EventEntry {
    if (!(name in entries)) {
        entries[name] = new EventEntry(name)
    }

    return entries[name]
}

type Dictionary<T> = { [key: string]: T }

class EventBus {
    entries: Dictionary<EventEntry> = {}

    on(
        events: ?(Array<string> | string),
        callback: Callback,
        once: boolean = false
    ): ?EventBus {
        if (!events) return null

        const normalizedEvents: Array<ParsedEvent> = normalizeEvents(events)

        normalizedEvents.forEach((event: ParsedEvent) => {
            if (event.name) {
                let entry: EventEntry = findEntryOrCreate(this.entries, event.name)
                entry.addCallback(event.namespaceList, callback, once)
            }
        })

        return this
    }

    once(
        events: ?(Array<string> | string),
        callback: Callback,
    ): ?EventBus {
        return this.on(events, callback, true)
    }

    off(
        events: ?(Array<string> | string),
        callback?: Callback
    ): ?EventBus {
        if (!events) {
            this.entries = {}
            return
        }

        const normalizedEvents = normalizeEvents(events)
        normalizedEvents.forEach((event: ParsedEvent) => {
            if (event.name) {
                let entry = this.entries[event.name]
                if (entry) {
                    entry.removeCallback(event.namespaceList, callback)
                }
            } else if (event.namespaceList) {
                Object.keys(this.entries).forEach((key: string) => {
                    this.entries[key].removeCallback(event.namespaceList, callback)
                })
            }
        })

        return this
    }

    trigger(event: ?string, ...data: Array<?any>): ?EventBus {
        if (!event) return

        let parsedEvent: ParsedEvent = parseEvent(event)
        if (!parsedEvent.name) return
        let entry = this.entries[parsedEvent.name]
        if (entry) {
            entry.fire(parsedEvent.namespaceList, ...data)
        }

        return this
    }
}

class EventEntry {
    _listeners: Array<EventListener>
    _name: string

    constructor(name: string) {
        this._name = name;
    }

    get listeners(): Array<EventListener> {
        if (this._listeners === undefined) {
            this._listeners = []
        }

        return this._listeners
    }

    get name(): string {
        return this._name
    }

    addCallback(namespaceList: Array<string>, callback: Callback, once: boolean = false): void {
        // use `unshift` instead of `push`
        // so that callbacks can be fired in the reverse order
        // `once-only` callback can be easily removed by `splice`
        this.listeners.unshift(new EventListener(callback, namespaceList.join('.'), once))
    }

    removeCallback(namespaceList: Array<string>, callback: ?Callback): void {
        let matcher = namespaceList.length && getNamespaceMatcher(namespaceList)

        for (let i = this.listeners.length - 1; i >= 0; i--) {
            if (!matcher || matcher.test(this.listeners[i].namespaces)) {
                if (!callback || this.listeners[i].callback === callback) {
                    this.listeners.splice(i, 1)
                }
            }
        }
    }

    fire(namespaceList: Array<string>, ...data: Array<?any>) {
        let matcher = namespaceList.length && getNamespaceMatcher(namespaceList)

        for (let i = this.listeners.length - 1; i >= 0; i--) {
            if (!matcher || matcher.test(this.listeners[i].namespaces)) {
                this.listeners[i].callback(...data)

                if (this.listeners[i].once) {
                    this.listeners.splice(i, 1)
                }
            }
        }
    }
}

type Callback = (...args?: Array<?any>) => ?any

class EventListener {
    _callback: Callback
    _once: boolean
    _namespaces: string

    constructor(_callback: Callback, _namespaces: string, _once: boolean) {
        this._callback = _callback
        this._once = _once
        this._namespaces = _namespaces
    }

    get callback(): Callback {
        return this._callback
    }

    get once(): boolean {
        return this._once
    }

    get namespaces(): string {
        return this._namespaces
    }
}

export default EventBus