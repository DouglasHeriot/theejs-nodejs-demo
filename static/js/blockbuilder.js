
var camera, scene, renderer;
var geometry, material, mesh;
var ambient;
var controls;
var socket;
var isDynamicResizing = false;

function init() {

	socket = io.connect(location.origin);
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	scene = new THREE.Scene();

	geometry = new THREE.CubeGeometry( 200, 200, 200 );
	material = new THREE.MeshLambertMaterial( { color: 0xffffff, ambient: 0x000000, shading: THREE.FlatShading } );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.0 );
	hemiLight.color.setHSL( 0.6, 1.0, 0.6 );
	hemiLight.groundColor.setHSL( 0.0, 0.0, 0.75 );
	hemiLight.position.set( -200, 500, 200 );
	scene.add( hemiLight );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	controls = new THREE.TrackballControls(camera, renderer.domElement);

	document.body.appendChild( renderer.domElement );

	socket.on('resize', function(data){
			var width = data.width;
			var height = data.height;
			console.log("Resizing window to " + data);
			isDynamicResizing = true;
			window.resizeTo(width, height);
			});

	socket.on('move', function(data){
			mesh.position.x = data.x;
			});

	window.addEventListener( 'resize', onWindowResize, false );
}

function animate() {

	// note: three.js includes requestAnimationFrame shim
	requestAnimationFrame( animate );

	//        mesh.rotation.x += 0.01;
	//       mesh.rotation.y += 0.02;

	controls.update();

	renderer.render( scene, camera );

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}


$(function(){
		$('#sliderX').change(function(){
			var value = this.valueAsNumber;
			console.log('Moved slider: ' + value);
			mesh.position.x = value;

			socket.emit('move', {x: value});
			});

		init();
		animate();
		});

