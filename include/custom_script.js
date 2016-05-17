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

    $(function () {

        $( "#tree_expand_all" ).click(function() {
            $("#jstree").jstree().open_all();
        });

        $( "#tree_collapse_all" ).click(function() {
            $("#jstree").jstree().close_all();
        });

        $("#jstree").on('ready.jstree', function() {
            $('#jstree').jstree('open_node', '.jstree-anchor:first', function(e, data) {   /* open the first level of the tree */
                $('#jstree_loading').hide();                                               /* Hide the "tree loading" message */
                $("#jstree").show();                                                       /* show the whole tree (it was hidden) */
            } ); 
        });

        $(document).on('click', 'a', function(event){

            if ($(this).attr('href').substr(0,1) == '#') {

                var target_id = $(this).attr('href').substr(1);

                if ($('#jstree').jstree(true).open_node(target_id) || $('#jstree').jstree(true).is_open(target_id)) {
                    $('#jstree').jstree(true).deselect_all();
                    $('#jstree').jstree(true).select_node(target_id);
                    if (fullHeightOfItemInView('#' + target_id + ' .jstree-themeicon')) {
                        // Do not jump to the link target if the target is in the tree and the full height of the tree node's icon is visible
                        event.preventDefault();
                    }
                }

            }

        });


        $('[data-toggle="tooltip"]').tooltip();

        $("#jstree").on('open_node.jstree show_node.jstree create_node.jstree', function(event, data) {
            $('#' + data.node.id + ' [data-toggle="tooltip"]').tooltip();
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