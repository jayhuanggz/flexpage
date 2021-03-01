
import Binding from './state_binding'


export default {
    create(context, target, config) {
        let sources = config.sources;
        let sourceWidgets = [];
        let watchedProps;

        if (sources && sources.length > 0) {
            sources.forEach(source => {
                let id = source;
                if (typeof source === 'object') {
                    id = source.id;
                    if (typeof id === 'string') {
                        if (typeof watchedProps === 'undefined') {
                            watchedProps = {};
                        }

                        if (source.watch && source.watch.length > 0) {
                            watchedProps[id] = source.watch;
                        }
                    }


                }

                if (typeof id === 'string') {

                    if (id === '$context') {
                        sourceWidgets.push(context);
                    } else {
                        let widget = context.widgetManager.findWidget(id);
                        if (widget) {
                            sourceWidgets.push(widget);
                        } else {
                            console.log('source widget not found:', id);
                        }
                    }


                }
            });
        }



        return new Binding(context, sourceWidgets, watchedProps, target,
            config.property,
            config.expression,
            config.transformers);


    }
}
