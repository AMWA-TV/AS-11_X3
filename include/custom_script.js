    function fullHeightOfItemInView(item)
    {
        // Returns True if the item is fully in view (ignoring margins of element) considering its height only (width completely ignored)
        // Probably will not work properly if item is nested inside a scrollable component
        // Might not work properly when the browser zoom is used

        var $item = $(item);
        var $window = $(window);

        var windowScrollTop = $window.scrollTop();
        var windowScrollBottom = windowScrollTop + $window.height();

        var itemTop = $item.offset().top;  // position of top of item (ignoring margin but including border and padding) relative to the document
        var itemBottom = itemTop + $item.outerHeight();  // position of bottom of element (ignoring margin but including border and padding) relative to the document

        return ((itemBottom <= windowScrollBottom) && (itemTop >= windowScrollTop));
    }

    function openTreeToLevel(tree, level)
    {
      $(tree.jstree(true).get_json(tree, {flat: true})).each(function() {
        var node_level = tree.jstree(true).get_node(this.id).parents.length;
        if (node_level <= level && !String(this.id).endsWith('-info')) {    /* don't open 'additional information' tree nodes with id ending in '-info' */
          tree.jstree(true).open_node(this.id);
        }
      });
    }

    $(function () {

        $( "#tree_expand_first" ).click(function() {
            $("#jstree").jstree().close_all();
            openTreeToLevel($("#jstree"), 1);
        });

        $( "#tree_expand_second" ).click(function() {
            $("#jstree").jstree().close_all();
            openTreeToLevel($("#jstree"), 2);
        });

        $( "#tree_expand_all" ).click(function() {
            $("#jstree").jstree().open_all();
        });

        $("#jstree").on('ready.jstree', function() {
            $('#jstree_loading').hide();              /* Hide the "tree loading" message */
            var node = $("#jstree").jstree('get_node', window.location.hash);
            if (node) { /* the hash corresponds to an element in the tree */
                /* Select the element corresponding to the hash, open to it
                   and also open it if it has children, and scroll to it.
                   As this procedure is done on page loading, we must ensure that the tree
                   has reached a state where the vertical position of the element within the page
                   has been accurately determined before we try to scroll to it.
                   At this point, that has not happened. It seems not to be reliable
                   until an after_open event is issued by an open_node() call.
                   We must therefore ensure that a successful call to open_node() is made.
                   If the target node has children, this is achieved by opening it,
                   but if it does not, its immediate parent is closed and opened
                   to achieve the same thing. */
                $("#jstree").jstree('select_node', node);
                if (node.children.length || node.parents.length) {
                    $("#jstree").one('after_open.jstree', function(e, data) {
                        $('html, body').scrollTop($(window.location.hash).offset().top);
                    });
                    if (node.children.length) {
                        $("#jstree").jstree('open_node', node);
                    } else {
                        $("#jstree").jstree('close_node', node.parents[0]);
                        $("#jstree").jstree('open_node', node.parents[0]);
                    }
                }
            } else {
                history.replaceState(null, null, document.location.pathname); /* if there is an unrecognised anchor, remove it */
                openTreeToLevel($("#jstree"), 2);
            }
            $("#jstree").show();                      /* show the whole tree (it was hidden) */
        });

        $(document).on('click', 'a', function(event){

            if ($(this).attr('href').substr(0,1) == '#') {

                var target_id = $(this).attr('href').substr(1);

                if (target_id == 'component-id-message') {
                    $('#component-id-message').modal()
                    // Do not jump to the link target
                    event.preventDefault();
                } else {

                    if ($('#jstree').jstree(true).open_node(target_id) || $('#jstree').jstree(true).is_open(target_id)) {
                        $('#jstree').jstree(true).deselect_all();
                        $('#jstree').jstree(true).select_node(target_id);
                        if (fullHeightOfItemInView('#' + target_id + ' .jstree-themeicon')) {
                            // Do not jump to the link target if the target is in the tree and the full height of the tree node's icon is visible
                            event.preventDefault();
                        }
                    }
                }
            }

        });


        $('[data-toggle="tooltip"]').tooltip();
        prettyPrint();

        $("#jstree").on('open_node.jstree show_node.jstree create_node.jstree', function(event, data) {
            $('#' + data.node.id + ' [data-toggle="tooltip"]').tooltip();

            if ($('#' + data.node.id + ' .prettyprint').length > 0) {
                prettyPrint();
            }

        });

        $("#jstree").on('select_node.jstree', function(e, data) {
            history.replaceState(null, null, document.location.pathname + '#' + data.node.id); /* allows URL with anchor to selected element to be copied */
        });

        $( "#tInfo_btn_show" ).click(function() {
            $('.tInfo').css( "display", "block" );
        });

        $( "#tInfo_btn_hide" ).click(function() {
            $('.tInfo').css( "display", "none" );
        });

        $( "#rInfo_btn_show" ).click(function() {
            $('.rInfo').css( "display", "block" );
        });

        $( "#rInfo_btn_hide" ).click(function() {
            $('.rInfo').css( "display", "none" );
        });

    });
