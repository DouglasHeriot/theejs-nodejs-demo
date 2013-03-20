
var camera, scene, renderer;
var geometry, material, mesh;
var ambient;
var controls;
var socket;


function newBlock(position, wireframe)
{
	geometry = new THREE.CubeGeometry(200, 200, 200);
	material = new THREE.MeshLambertMaterial({color: 0xffffff, ambient: 0x000000, shading: THREE.FlatShading, wireframe: wireframe});
	var block = new THREE.Mesh(geometry, material);
	block.position.x = position.x;
	block.position.y = position.y;
	block.position.z = position.z;
	return block;
}

function init()
{
	socket = io.connect(location.protocol + '//' + location.hostname + ':8080');
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 2000;

	scene = new THREE.Scene();

	mesh = newBlock({x: 0, y: 0, z:0}, true);
	scene.add(mesh);

	hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.0);
	hemiLight.color.setHSL(0.6, 1.0, 0.6);
	hemiLight.groundColor.setHSL(0.0, 0.0, 0.75);
	hemiLight.position.set(-200, 500, 200);
	scene.add(hemiLight);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	controls = new THREE.TrackballControls(camera, renderer.domElement);

	document.body.appendChild(renderer.domElement);

	socket.on('move', function(data){
			mesh.position = data.position;
			});

	socket.on('place', function(data){
			scene.add(newBlock(data.position, false));
			});
}

function animate()
{
	requestAnimationFrame( animate );

	controls.update();
	renderer.render( scene, camera );
}

$(function(){
		$('#sliderX').change(function(){
			mesh.position.x = this.valueAsNumber;
			socket.emit('move', {position: mesh.position});
			});
		$('#sliderY').change(function(){
			mesh.position.y = this.valueAsNumber;
			socket.emit('move', {position: mesh.position});
			});
		$('#sliderZ').change(function(){
			mesh.position.z = this.valueAsNumber;
			socket.emit('move', {position: mesh.position});
			});

		$('#placeBlockButton').click(function(){
			scene.add(newBlock(mesh.position, false));
			socket.emit('place', {position: mesh.position});
			});

		$(window).resize(function(){
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
			});

		init();
		animate();
});

