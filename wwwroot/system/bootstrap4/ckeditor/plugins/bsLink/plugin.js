CKEDITOR.plugins.add( 'bsLink', {
    icons: 'link',
    init: function( editor ) {
        editor.addCommand( 'customLink', {
            exec: function( editor ) {

				var selection = CKEDITOR.instances['ck' + editorFocus].getSelection().getSelectedText();
			
				var modal = $('#linkModal');
				var scratch = '';
			
				if (modal.length === 0){
				
					scratch += '<div id="linkModal" class="modal fade">';
						scratch += '<div class="modal-dialog modal-lg" role="document">';
							scratch += '<div class="modal-content">';
								scratch += '<div class="modal-header" style="background-color:#f8f8f8!important;">';
									scratch += '<h5 class="modal-title ml-1"><i class="fa fa-link" aria-hidden="true"></i> &nbsp;Insert hyperlink</h5>';
									scratch += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
										scratch += '<span aria-hidden="true">&times;</span>';
									scratch += '</button>';
								scratch += '</div>';
								scratch += '<div class="modal-body">';
									scratch += '<div class="form-group row">';
										scratch += '<label for="linkURL" class="col-2 col-form-label">Product/URL</label>';
										scratch += '<div class="col-10">';
											scratch += '<input type="text" class="form-control" id="linkURL">';
										scratch += '</div>';
									scratch += '</div>';
									scratch += '<div class="form-group row">';
										scratch += '<label for="linkTitle" class="col-2 col-form-label">Text</label>';
										scratch += '<div class="col-10">';
											scratch += '<input type="text" class="form-control" value="' + selection + '" id="linkTitle">';
										scratch += '</div>';
									scratch += '</div>';
									scratch += '<div class="form-group row">';
										scratch += '<label for="linkTab" class="col-2 col-form-label">Opens in...</label>';
										scratch += '<div class="col-10">';
											scratch += '<select class="form-control" id="linkTab" style="width:auto;">';
												scratch += '<option value="">same tab</option>';
												scratch += '<option value=" target=\'_blank\'">new tab</option>';
											scratch += '</select>';
										scratch += '</div>';
									scratch += '</div>';				
								scratch += '</div>';
								scratch += '<div class="modal-footer">';
									scratch += '<button type="button" class="btn btn-secondary cmd-link-ok">OK</button>';					
									scratch += '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
								scratch += '</div>';
							scratch += '</div>';
						scratch += '</div>';
					scratch += '</div>';
			
					modal = $(scratch);
					
				}
				console.log(selection);
				$('#linkTitle').val(selection);
				modal.modal();
				

				
            }
            
        });
        
        editor.ui.addButton( 'link', {
        
            label: 'Insert hyperlink',
            command: 'customLink',
            toolbar: 'links,0'
            
        });
        
    }
    
});