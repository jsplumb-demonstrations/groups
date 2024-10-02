<script>
    import {
        ForceDirectedLayout,
		AbsoluteLayout,
		QuadraticBezierConnector,
        newInstance,
        AnchorLocations,
        ArrowOverlay,
        BlankEndpoint,
		LassoPlugin,
		DEFAULT, EVENT_TAP,
        EVENT_CLICK, EVENT_CANVAS_CLICK,
        EVENT_SURFACE_MODE_CHANGED,
        EVENT_GROUP_ADDED

    } from '@jsplumbtoolkit/browser-ui'

    import {
		SurfaceProvider,
		SurfaceComponent,
		MiniviewComponent,
		ControlsComponent,
		PaletteComponent
	} from "@jsplumbtoolkit/browser-ui-svelte"

    import NodeComponent from './NodeComponent.svelte'
    import GroupComponent from './GroupComponent.svelte'
	import HeadlessGroupComponent from './HeadlessGroupComponent.svelte'

    let surfaceComponent

    const toolkit = newInstance({
        groupFactory: (type, data, callback) => {
            data.title = "Group " + (toolkit.getGroupCount() + 1)
            callback(data)
            return true
        },
        nodeFactory: (type, data, callback) => {
            data.name = (toolkit.getNodeCount() + 1)
            callback(data)
            return true
        }
    })

    const view = {
        nodes: {
            [DEFAULT]: {
                component: NodeComponent,
                events: {
                    [EVENT_TAP]: (params) => {
                        toolkit.toggleSelection(params.node);
                    }
                }
            }
        },
        groups: {
            [DEFAULT]: {
                component: GroupComponent,
                endpoint: BlankEndpoint.type,
                anchor: AnchorLocations.Continuous,
                revert: false,
                orphan: true,
                constrain: false,
                autoSize: true,
                layout: {
                    type: AbsoluteLayout.type
                },
                padding: 10
            },
            constrained: {
                parent: DEFAULT,
                constrain: true
            },
            elastic: {
                component: HeadlessGroupComponent,
                elastic: true,
                minSize: {w: 250, h: 250},
                padding: 10
            }
        },
        edges: {
            [DEFAULT]: {
                events: {
                    [EVENT_CLICK]: function () {
                        console.log(arguments)
                    }
                }
            }
        }
    };

    const renderOptions = {
        layout: {
            type: ForceDirectedLayout.type,
            options: {
                absoluteBacked: true
            }
        },
        defaults: {
            connector: {
				type: QuadraticBezierConnector.type,
				options: {cssClass: "connectorClass", hoverClass: "connectorHoverClass"}
			},
            paintStyle: {strokeWidth: 1, stroke: '#89bcde'},
            hoverPaintStyle: {stroke: "orange"},
            connectionOverlays: [
                {type: ArrowOverlay.type, options: {fill: "#09098e", width: 10, length: 10, location: 1}}
            ]
        },
        plugins: [
            LassoPlugin.type
        ],
        dragOptions: {
            filter: ".delete *, .group-connect *, .delete"
        },
        magnetize: {
            afterDrag: true,
            afterGroupExpand: true
        },
        events: {
            [EVENT_CANVAS_CLICK]: (surface) => {
				surface.toolkitInstance.clearSelection()
            },
            [EVENT_SURFACE_MODE_CHANGED]: (mode) => {
                renderer.removeClass(document.querySelector("[mode]"), "selected-mode");
                renderer.addClass(document.querySelector("[mode='" + mode + "']"), "selected-mode");
            },
            [EVENT_GROUP_ADDED]: (group) => {
                console.log("New group " + group.id + " added")
            }
        },
        consumeRightClick: false,
        zoomToFit: true
    }


</script>

<div class="jtk-demo-main">

<SurfaceProvider>
    <!-- this is the main drawing area -->
    <div class="jtk-demo-canvas">

        <SurfaceComponent viewOptions={view}
                          renderOptions={renderOptions}
                          toolkit={toolkit}
                          bind:this={surfaceComponent}
                        url="./dataset.json">

            <MiniviewComponent/>
            <ControlsComponent/>

        </SurfaceComponent>
    </div>

    <div class="jtk-demo-rhs">

        <PaletteComponent class="sidebar node-palette">
            <div title="Drag Node to canvas" data-type="default" class="sidebar-item">
                <i class="icon-tablet"></i>Drag Node
            </div>
            <div title="Drag Group to canvas" data-jtk-is-group="true" data-type="default" class="sidebar-item">
                <i class="icon-tablet"></i>Drag Group
            </div>
			<div title="Drag Group to canvas" data-jtk-is-group="true" data-type="elastic"
				 class="sidebar-item">
				<i class="icon-tablet"></i>Drag Elastic Group
			</div>
        </PaletteComponent>


        <div class="description">
			<div class="h3">Nested Groups</div>
			<p>JsPlumb has comprehensive support for groups, which can be nested to an arbitrary level. When groups are collapsed any edges to/from
				children of the group are relocated to the group. You can collapse and expand groups in this demo with the `-` and `+` buttons.
			</p>
			<p>Group 1 in this demo has `autoSize` switched on, and will resize when new nodes are dropped into the group, or nodes are deleted or dragged
				out.</p>
			<p>Group 2 has `constrain` set, meaning that child nodes cannot be dragged outside of its bounds.</p>

			<div class="h5 my-3">Elastic Groups</div>
			<p>The headless group in this app is an <strong>elastic</strong> group, which is a type of group that is available from 6.10.0 onwards. When you drag a child node
				around in an elastic group, the group will resize to always encompass its child nodes (while still respecting any <code>minSize</code> or <code>maxSize</code> you
				may have set).  If you want to drag a node out of an elastic group, hold down the Shift key while dragging. </p>
			<p>By default, an elastic group will resize from any edge. This can be switched off programmatically via setting `allowResizeFromOrigin:false` on a
				group definition, and you can also switch it off on an ad-hoc basis by holding down the Ctrl or Meta key while dragging (on a Mac the Meta key
				is the Command key).
			</p>

			<div class="h5 my-3">Further reading</div>
			<p>
				Read about this demo itself in our docs: <a href="https://docs.jsplumbtoolkit.com/toolkit/6.x/lib/starter-app-groups" target="_blank">https://docs.jsplumbtoolkit.com/toolkit/6.x/lib/starter-app-groups</a>
			</p>
			<p>
				Read about groups in detail here:<a href="https://docs.jsplumbtoolkit.com/toolkit/6.x/lib/groups" target="_blank">https://docs.jsplumbtoolkit.com/toolkit/6.x/lib/groups</a>
			</p>
        </div>
    </div>


</SurfaceProvider>
</div>
