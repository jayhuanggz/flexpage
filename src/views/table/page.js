export default {

    items: [

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
                        type: "select",
                        config: {
                            property: "locationId",
                            label: 'Location',
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
                ],
                buttons: [
                    {
                        type: "primary",
                        label: "Submit",
                        action: {
                            id: "submit"

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

            type: 'table',
            config: {
                bindings: [{
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
                        label: "Create",
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
                    label: 'Delete',
                    popConfirm: {
                        title: 'Confirm to delete？'
                    },
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
                        label: 'Edit',
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
                        label: 'Delete',
                        type: 'text',
                        popConfirm: {
                            title: 'Confirm to delete？'
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