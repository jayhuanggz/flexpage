# FlexPage

FlexPage is a front end framework for building low code admin applications. It is written in VUe, Vuex, ElementUI and webpack, though it should be easy to convert to React. In FlexPage, a page can be defined by JSON schema, with components, interactions, datasources, no extra code is needed. 

FlexPage is not another JSON schema based form renderer, it is framework to build low code or no code admin applications. It does not only deal with forms, it provides state binding, datasources, data transformers, and more, to support writing fully functional pages with JSON. 

With FlexPage, you can do things like:

* Build complex forms with json, with a set of built in configurable components and custom components. Components can interact with each other
* Page component interactions, like reload a table when a search form submits, open a popup when you click a button. 
* Define datasources for your components, a datasource can be an ajax
* Define custom actions in response to user interactions on your page, like opening an url when you click a button, show/hide an element when you toggle a switch box
* Formatting, decorating your display data, like money, image, tag, date & datetime, you can define how your data display on the page.
* Everything is extensible, you can extend according to the UX & UI design of your project.
      

Here is an simple example of a page with a form, the form's model is output as json as you input. What you need is only a json file and few lines of code that renders the page:

```
<template>
  <div>
    <flexpage
      v-bind="page"
    ></flexpage>
  </div>
</template>

<script>

import flexpage from 'flexpage';

const json =  {
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


export default {
  components: { flexpage },
  data() {
    return {
      page: json,
    };
  },
};
</script>
```

Page screen shot:
![](https://blog.renqilai.com/content/images/2021/02/1.PNG)

The page is fully functional, all user interactions are implemented. 
You can see a little more complicated example of a table interacting with a search form : https://github.com/jayhuanggz/flexpage/wiki/Example:-Table-with-search-form



