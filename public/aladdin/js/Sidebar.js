/* global UI */

/**
 * @author mrdoob / http://mrdoob.com/
 * @author: Saeid Nourian (snourian@concord.org)
 */

var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	//

	var sceneTab = new UI.Text( 'SCENE' ).onClick( onClick );
	var projectTab = new UI.Text( 'PROJECT' ).onClick( onClick );
	var settingsTab = new UI.Text('SETTINGS').onClick(onClick);
	var energyTab = new UI.Text('ENERGY').onClick(onClick);
	var mapTab = new UI.Text('MAP').onClick(onClick);

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add(sceneTab, projectTab, settingsTab, energyTab, mapTab);
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//

	var scene = new UI.Span().add(
		new Sidebar.Scene( editor ),
		new Sidebar.Properties( editor ),
		new Sidebar.Animation( editor ),
		new Sidebar.Script( editor )
	);
	container.add( scene );

	var project = new UI.Span().add(
		new Sidebar.Project( editor )
	);
	container.add( project );

	var settings = new UI.Span().add(
		new Sidebar.Settings( editor ),
		new Sidebar.History( editor )
	);
	container.add(settings);

	var energy = new UI.Span().add(new Sidebar.Energy(editor));
	container.add(energy);

	var map = new UI.Span().add(new Sidebar.Map(editor));
	container.add(map);

	//

	function select( section ) {

		sceneTab.setClass( '' );
		projectTab.setClass( '' );
		settingsTab.setClass('');
		energyTab.setClass('');
		mapTab.setClass('');

		scene.setDisplay('none');
		project.setDisplay( 'none' );
		settings.setDisplay( 'none' );
		energy.setDisplay('none');
		map.setDisplay('none');

		switch ( section ) {
			case 'SCENE':
				sceneTab.setClass( 'selected' );
				scene.setDisplay( '' );
				break;
			case 'PROJECT':
				projectTab.setClass( 'selected' );
				project.setDisplay( '' );
				break;
			case 'SETTINGS':
				settingsTab.setClass( 'selected' );
				settings.setDisplay( '' );
				break;
			case 'ENERGY':
				energyTab.setClass('selected');
				energy.setDisplay('');
				break;
			case 'MAP':
				mapTab.setClass('selected');
				map.setDisplay('');
				break;
		}

	}

	select( 'SCENE' );

	return container;

};
