/* global Sidebar, UI */

/**
 * @author mrdoob / http://mrdoob.com/
 * @author Saeid Nourian (snourian@concord.org)
 */

Sidebar.Properties = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Span();

	var elementTab = new UI.Text('ELEMENT').onClick(onClick);
	var objectTab = new UI.Text('OBJECT').onClick(onClick);
	var geometryTab = new UI.Text('GEOMETRY').onClick(onClick);
	var materialTab = new UI.Text( 'MATERIAL' ).onClick( onClick );

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add(elementTab, objectTab, geometryTab, materialTab);
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//
	var element = new UI.Span().add(new Sidebar.Element(editor));
	container.add(element);

	var object = new UI.Span().add(
		new Sidebar.Object( editor )
	);
	container.add( object );

	var geometry = new UI.Span().add(
		new Sidebar.Geometry( editor )
	);
	container.add( geometry );

	var material = new UI.Span().add(
		new Sidebar.Material( editor )
	);
	container.add( material );

	//

	function select( section ) {

		elementTab.setClass('');
		objectTab.setClass( '' );
		geometryTab.setClass( '' );
		materialTab.setClass( '' );

		element.setDisplay('none');
		object.setDisplay('none');
		geometry.setDisplay('none');
		material.setDisplay( 'none' );

		switch ( section ) {
			case 'ELEMENT':
				elementTab.setClass('selected');
				element.setDisplay('');
				break;
			case 'OBJECT':
				objectTab.setClass( 'selected' );
				object.setDisplay( '' );
				break;
			case 'GEOMETRY':
				geometryTab.setClass( 'selected' );
				geometry.setDisplay( '' );
				break;
			case 'MATERIAL':
				materialTab.setClass( 'selected' );
				material.setDisplay( '' );
				break;
		}

	}

	select( 'OBJECT' );

	return container;

};
