const register = (event_category, event_label, value) => {

    if (!window.location.port) {
        gtag('event', 'user_action', {
            'event_category': event_category,
            'event_label': event_label,
            'value': value
        });
    }
}

export default register