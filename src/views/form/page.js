export default {
    items: [
        {
            type: "text",
            config: {
                tag: 'h2',
                value: "This is a form"
            }
        },
        {

            id: "form",
            type: "form",
            config: {
                inline: true,
                items: [
                    {
                        type: "input",
                        config: {
                            property: "name",
                            label: "Name"
                        }
                    },
                    {
                        type: "input",
                        config: {
                            property: "number",
                            type: 'number',
                            label: "Number"
                        }
                    },
                    {
                        type: "switch",
                        config: {
                            property: "enabled",
                            label: "Enabled"
                        }
                    },

                    {
                        type: "select",
                        config: {
                            multiple: false,
                            property: "select",
                            label: 'Select',
                            options: [{
                                value: 1,
                                label: 'Option 1'
                            }, {
                                value: 2,
                                label: 'Option 2'
                            }, {
                                value: 3,
                                label: 'Option 3'
                            }]
                        }
                    },
                    {
                        type: "date",
                        config: {
                            property: "date",
                            label: "Date",
                            min: {
                                value: -7,
                                unit: 'days'
                            },
                            max: 'now'
                        }
                    },

                    {
                        type: "date_range",
                        config: {
                            property: "dates",
                            label: "Date Range",
                            min: {
                                value: -7,
                                unit: 'days'
                            },
                            max: {
                                value: 30,
                                unit: 'days'
                            }
                        }
                    },
                    {
                        type: "image",
                        config: {
                            property: "image",
                            label: "Image"
                        }
                    },

                ],
                buttons: [
                    {
                        type: "primary",
                        label: "Submit",
                        action: {
                            id: "submit",
                            delegate: {
                                id: 'http',
                                params: {
                                    http: {
                                        method: 'POST',
                                        url: 'https://api.mybackend.com/api/admin/products',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    },
                                    body: '$scope'
                                }
                            }

                        }
                    },
                    {
                        label: "Reset",
                        action: {
                            id: "reset"
                        }
                    }
                ]
            }
        },
        {
            type: 'text',
            config: {
                value: 'This is form data in JSON:'
            }
        },
        {
            type: "text",
            config: {
                bindings: [{
                    sources: [{
                        id: 'form',
                        watch: ['model']
                    }],
                    property: 'model',
                    expression: 'JSON.stringify(form.model)'

                }]
            }
        }

    ]
}