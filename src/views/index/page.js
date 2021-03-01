export default {
    datasource: {
        type: "direct",
        params: {
            name: 'this is the name from datasource defined in page scope'
        }
    },
    value: {
        name: 'haha value'
    },
    items: [
        {
            type: "text",
            config: {
                value: "Text组件",
                bindings: [{
                    sources: [{
                        id: '$context',
                        watch: ['model']
                    }],
                    expression: "$context.model.name",
                    property: 'model'
                }]
            }
        },

        {
            type: 'tab',
            config: {
                tabs: [{
                    label: '商品列表',
                    items: []
                }, {
                    label: '新增商品',
                    items: []
                }, {
                    label: '商品详情',
                    items: []
                }]
            }

        },

        {
            id: "form",
            type: "form",
            config: {
                datasource: {

                    type: "direct",
                    config: {
                        base: "http://192.168.0.222:8088"
                    },
                    params: {
                        /*      url: "/api/admin/devices/detail",
                             params: {
                                 id: 500547205678019
                             },
                             headers: {
                                 Authorization:
                                     "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsid3giLCJjdXN0b21lcl9hbGkiLCJxdXhpYS13eCIsIm1lcmNoYW50LWFwaSIsImFkbWluIiwicHJvbW90ZXIiLCJ0b25nY2hlbmctd3giLCJtZXJjaGFudC1hZG1pbiJdLCJleHAiOjE2MDk4NzQyMjAsInVzZXJfbmFtZSI6InRlc3QiLCJqdGkiOiJiOTFmMmZjNS05ZTExLTQwOWQtOTQ1NS0yYjVhZGExMTRhZDIiLCJjbGllbnRfaWQiOiJ0ZXN0Iiwic2NvcGUiOlsiYmFzZSJdfQ.V-a-0k5CEPGbIe9jn-XaHnXWzbDed1Zj-H522kCDYhd-6IDTke5wV-NNkX2vG1m4FZkx8XH8KEe7UKfCj8X1e-mG9fBOYDCmkL36039T3ovBrR3Lo8AEdkCWheMGFc9JaGmr8kadtXfKrywHt2LnKc29Z-JWfszHhHiyHF-_YD9GUQ-9hkbuZ8owL9FHP6RzzkkcOmWRl0XHgVRIZppHktja_Bk_9jGbdcFhGSYajGgDty0gzbhYIFhSZQI0rYouBUifUL_Un-s8HnkuBJ2oUaLV8t36B4L6o0Yw2P6iCHhPZF3cdQteBKeTxqWDKXngLNDhHxcer0qnteO1VTOFsw"
                             } */

                        id: 1000,
                        name: "Jay",
                        image: "https://cdn.renqilai.com/2020_02_25/12_21_05.jpg",
                        images: ['https://cdn.renqilai.com/2020_02_25/12_21_05.jpg', 'https://cdn.renqilai.com/2020_02_25/12_21_05.jpg'],
                        items: [
                            {
                                name: "sub11",
                                name2: "sub12"
                            }, {
                                name: "sub21",
                                name2: "sub22"
                            }
                        ]

                    }
                },
                items: [
                    {
                        id: "input1",

                        type: "input",
                        config: {
                            placeholder: "test placeholder",
                            property: "name",
                            value: "Jay",
                            label: "Name"
                        }
                    },
                    {
                        id: "input2",

                        type: "input",
                        config: {
                            placeholder: "test placeholder",
                            property: "name2",
                            value: "Jay2",
                            label: "Name2",
                            disabled: true,
                            bindings: [{
                                sources: ['input1'],
                                expression: "'hello world,' +  input1.model",
                                property: 'model'
                            }]
                        }
                    }, {
                        type: "input",
                        config: {
                            placeholder: "带校验规则的",
                            property: "validated",
                            label: "Validated Input",
                            rules: [{
                                required: true,
                                message: '这是必填'
                            }, {
                                length: 10,
                                message: '字数要刚好10'
                            }]
                        }
                    }, {
                        id: "showSection",
                        type: "switch",
                        config: {
                            property: "showSection",
                            label: "显示下面的Section"
                        }
                    },
                    {
                        id: "showPopup",
                        type: "switch",
                        config: {
                            property: "showPopup",
                            label: "显示弹窗",
                            bindings: [{
                                sources: ['popup'],
                                expression: "!popup.hidden",
                                property: 'model'
                            }]
                        }
                    },
                    {
                        id: 'popup',
                        type: "popup",
                        config: {
                            label: '测试弹窗',
                            items: [{
                                type: 'form',
                                config: {
                                    items: [
                                        {
                                            id: 'popupInput1',
                                            type: "input",
                                            config: {
                                                property: "popupInput1",
                                                value: "",
                                                label: "popup input 1"
                                            }
                                        }, {
                                            id: 'popupInput2',
                                            type: "input",
                                            config: {
                                                property: "popupInput2",
                                                value: "",
                                                label: "popup input 2"
                                            }
                                        }
                                    ]
                                }
                            }],
                            footerButtons: [{
                                label: '关闭',
                                action: {
                                    id: 'close'
                                }
                            }, {
                                type: 'primary',
                                label: '确认',
                                action: {
                                    id: 'confirm'
                                }
                            }],
                            bindings: [{
                                sources: ['showPopup'],
                                expression: "!showPopup.model",
                                property: 'hidden'
                            }, {
                                sources: ['popupInput1'],
                                expression: "popupInput1.model",
                                property: 'model'
                            }]

                        }
                    },

                    {
                        type: 'select_popup',
                        config: {
                            property: 'products',
                            label: '弹窗选择商品',
                            valueProp: 'id',
                            labelProp: 'name',
                            popup: {
                                id: "productPopup",
                                type: "popup",
                                config: {

                                    bindings: [{
                                        sources: [{
                                            id: 'productSearchTable',
                                            watch: 'selected'
                                        }],
                                        expression: "productSearchTable.selected",
                                        property: 'model',
                                        transformers: [{
                                            id: 'include',
                                            config: {
                                                props: 'rows'
                                            }
                                        },
                                            'unwrap',
                                        {
                                            id: 'include',
                                            config: {
                                                props: ['id', 'name']
                                            }
                                        }]
                                    }],
                                    title: '选择商品',
                                    items: [
                                        {
                                            id: 'productSearchForm',
                                            type: "form",
                                            config: {
                                                inline: true,
                                                items: [
                                                    {
                                                        id: 'productName',
                                                        type: "input",
                                                        config: {
                                                            property: "name",
                                                            label: "名称"
                                                        }
                                                    }
                                                ],
                                                buttons: [
                                                    {
                                                        type: "primary",
                                                        label: "搜索",
                                                        action: {
                                                            id: "submit"
                                                        }
                                                    },
                                                    {
                                                        label: "重置",
                                                        action: {
                                                            id: "reset"
                                                        }
                                                    }
                                                ]
                                            }
                                        },

                                        {
                                            id: "productSearchTable",
                                            type: 'table',
                                            config: {
                                                bindings: [{
                                                    sources: [{
                                                        id: 'productSearchForm',
                                                        watch: 'submittedModel'
                                                    }],
                                                    expression: 'productSearchForm.submittedModel',
                                                    property: 'filter'
                                                }],
                                                datasource: {
                                                    type: 'api',
                                                    params: {
                                                        url: '/api/admin/products'
                                                    }
                                                },
                                                cols: [
                                                    {
                                                        property: "id",
                                                        label: "Id",
                                                        sortable: false,
                                                        id: true
                                                    },
                                                    {
                                                        property: "name",
                                                        label: "名称"

                                                    },
                                                    {
                                                        property: "price",
                                                        label: "价格",
                                                        dataType: "money"


                                                    },
                                                    {
                                                        property: "image",
                                                        label: "照片",
                                                        dataType: "image"

                                                    },
                                                    {
                                                        property: "createdDate",
                                                        label: "创建时间",
                                                        dataType: "datetime",
                                                        sortable: true

                                                    }
                                                ],
                                                pagination: {
                                                    pageSize: 10,
                                                    pageSizes: [10, 20, 50],

                                                    datasource: {
                                                        type: 'api',
                                                        params: {
                                                            url: '/api/admin/products/count'
                                                        }
                                                    }
                                                },
                                                headerButtons: [{
                                                    bindings: [
                                                        {
                                                            sources: [{
                                                                id: 'productSearchTable',
                                                                watch: 'selected'
                                                            }],
                                                            property: 'disabled',
                                                            expression: '!(productSearchTable.selected.rows && productSearchTable.selected.rows.length>0)'

                                                        }
                                                    ],
                                                    label: '确定选择',
                                                    action: {
                                                        id: 'invoke',
                                                        params: {
                                                            target: 'productPopup',
                                                            method: 'confirm'
                                                        }
                                                    }
                                                }]


                                            }
                                        }]

                                }
                            },

                        }
                    },

                    {
                        type: "section",
                        config: {
                            items: [{
                                type: "input",
                                config: {
                                    property: "sectionInput1",
                                    value: "",
                                    label: "section input 1"
                                }
                            }, {
                                type: "input",
                                config: {
                                    property: "sectionInput2",
                                    value: "",
                                    label: "section input 2"
                                }
                            }],
                            bindings: [{
                                sources: ['showSection'],
                                expression: "!showSection.model",
                                property: 'hidden'
                            }]
                        }
                    },

                    {
                        type: "select",
                        config: {
                            multiple: true,
                            property: "locationId",
                            label: '选择场地',
                            datasource: {
                                type: 'api',
                                params: {
                                    url: '/api/admin/locations/select'
                                }
                            },
                            valueProp: 'id',
                            labelProp: 'name'
                        }
                    },
                    {
                        id: "targetType",
                        type: "radio",
                        config: {
                            property: "targetType",
                            label: '投放目标',
                            options: [{
                                value: 'device',
                                label: '设备'
                            }, {
                                value: 'location',
                                label: '场地'
                            }]
                        }
                    },

                    {
                        type: "select",
                        config: {
                            multiple: false,
                            property: "targetId",
                            label: '选择设备',
                            datasource: {
                                type: 'api',
                                params: {
                                    url: '/api/admin/locations/select'
                                }
                            },
                            valueProp: 'id',
                            labelProp: 'name',
                            bindings: [{
                                property: "hidden",
                                sources: ['targetType'],
                                expression: "targetType.model  !== 'device'"
                            }]
                        }
                    }, {
                        type: "select",
                        config: {
                            multiple: false,
                            property: "targetId",
                            label: '选择场地',
                            datasource: {
                                type: 'api',
                                params: {
                                    url: '/api/admin/locations/select'
                                }
                            },
                            valueProp: 'id',
                            labelProp: 'name',
                            bindings: [{
                                property: "hidden",
                                sources: ['targetType'],
                                expression: "targetType.model  !== 'location'"
                            }]
                        }
                    },

                    {
                        type: "date",
                        config: {
                            property: "date",
                            value: "Jay",
                            label: "日期",
                            min: {
                                value: -7,
                                unit: 'days'
                            },
                            max: 'now'
                        }
                    },
                    {
                        id: "switch1",
                        type: "switch",
                        config: {
                            property: "showDate",
                            label: "显示日期"
                        }
                    },
                    {
                        type: "date_range",

                        config: {
                            property: "dates",
                            label: "时间区间",
                            min: {
                                value: -7,
                                unit: 'days'
                            },
                            max: {
                                value: 30,
                                unit: 'days'
                            },
                            bindings: [{
                                property: "hidden",
                                sources: ['switch1'],
                                expression: 'switch1.model !==true'
                            }]
                        }
                    },
                    {
                        type: "image",
                        config: {
                            property: "image",
                            label: "图片"
                        }
                    }, {
                        type: "image_list",
                        config: {
                            property: "images",
                            label: "多张图片"
                        }
                    },
                    {
                        type: "comboList",
                        config: {
                            property: "items",
                            itemConfig: {
                                inline: true,
                                items: [
                                    {
                                        type: "input",
                                        config: {
                                            placeholder: "test placeholder",
                                            property: "name",
                                            value: "Jay",
                                            label: "Name",

                                        }
                                    },
                                    {

                                        type: "input",
                                        config: {
                                            placeholder: "test placeholder",
                                            property: "name2",
                                            value: "Jay",
                                            label: "Name 2"
                                        }
                                    }
                                ]
                            }
                        }
                    }
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
                                        method: 'PUT',
                                        url: 'https://rapapi.renqilai.com/app/mock/39/api/admin/products',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    },
                                    urlParams: {
                                        id: '$scope.id'
                                    },
                                    body: '$scope',
                                    transformers: []
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
        }, {

            type: 'detail',
            config: {

                bindings: [
                    {
                        property: "datasourceRequestParams",
                        expression: "$context.variables"
                    }
                ],

                datasource: {
                    type: 'api',
                    params: {
                        url: '/api/admin/products/detail',
                        params: { id: '=$context.variables.id' }
                    }
                },
                fields: [
                    {
                        property: "id",
                        label: "Id",
                        id: true
                    },
                    {
                        property: "name",
                        label: "名称"
                    },
                    {
                        property: "price",
                        label: "价格",
                        dataType: "money"
                    },
                    {
                        property: "state",
                        label: "状态",
                        dataType: "enum",
                        dataTypeConfig: {
                            values: {
                                PENDING: '待审核',
                                APPROVED: '审核通过',
                                REJECTED: "审核不通过"
                            }
                        },
                        decorators: [{
                            type: 'tag',
                            config: {
                                type: {
                                    PENDING: 'warning',
                                    APPROVED: 'success',
                                    REJECTED: 'danger'
                                }

                            }
                        }]
                    },
                    {
                        property: "displayImage",
                        label: "图片",
                        dataType: "image"
                    },
                    {
                        property: "createdDate",
                        label: "创建时间",
                        dataType: "datetime"
                    }
                ]
            }
        }, {

            type: 'table',
            config: {
                bindings: [{
                    sources: [{
                        id: 'input1',
                        watch: 'model'
                    }],
                    expression: "input1.model === 'hide'",
                    property: 'hidden'
                }, {
                    //綁定id为form的表单数据model作为这个table组件的filter属性值
                    //用作table组件绑定页面任意一个form作为搜索条件
                    sources: [{
                        id: 'form',
                        watch: 'submittedModel'
                    }],
                    expression: "form.submittedModel",
                    property: 'filter'
                }],
                datasource: {
                    type: 'api',
                    params: {
                        url: '/api/admin/products'
                    }
                },
                cols: [
                    {
                        property: "id",
                        label: "Id",
                        sortable: false,
                        id: true
                    },
                    {
                        property: "name",
                        label: "名称"

                    },
                    {
                        property: "price",
                        label: "价格",
                        dataType: "money"


                    },
                    {
                        property: "image",
                        label: "照片",
                        dataType: "image"

                    },
                    {
                        property: "createdDate",
                        label: "创建时间",
                        dataType: "datetime",
                        sortable: true

                    }
                ],
                pagination: {
                    pageSize: 10,
                    pageSizes: [10, 20, 50],

                    datasource: {
                        type: 'api',
                        params: {
                            url: '/api/admin/products/count'
                        }
                    }
                },

                headerButtons: [
                    {
                        type: "primary",
                        label: "新建商品",
                        action: {
                            id: "url",
                            params: {
                                blank: true,
                                url: 'https://baidu.com'
                            }
                        }
                    }
                ],
                headerActions: [{
                    id: 'http',
                    label: '批量删除',
                    params: {
                        http: {
                            method: 'DELETE',
                            url: 'https://rapapi.renqilai.com/app/mock/39/api/admin/products/batch'
                        },
                        urlParams: {
                            ids: '$scope.ids.join(",")'
                        },
                        postAction: {
                            id: 'invoke',
                            params: {
                                method: 'reloadAll'
                            }
                        }
                    }
                }],
                rowActions: [
                    {
                        id: 'url',
                        label: '详情',
                        type: 'text',
                        params: {
                            blank: true,
                            url: 'https://rapapi.renqilai.com/app/mock/39/api/admin/products',
                            transformers: [{
                                id: 'include',
                                config: {
                                    props: 'id'
                                }
                            }]
                        }
                    },

                    {
                        id: 'http',
                        label: '删除',
                        type: 'text',
                        popConfirm: {
                            title: '确认删除吗？'
                        },
                        params: {
                            http: {
                                method: 'DELETE',
                                url: 'https://rapapi.renqilai.com/app/mock/39/api/admin/products',
                            },
                            urlParams: {
                                id: '$scope.id'
                            },
                            transformers: [],
                            postAction: {
                                id: 'invoke',
                                params: {
                                    method: 'reloadAll'
                                }
                            }
                        }

                    }
                ]
            }
        }
    ]
}