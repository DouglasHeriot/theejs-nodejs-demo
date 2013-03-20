
var camera, scene, renderer;
var geometry, material, mesh;
var ambient;
var controls;
var socket;
var cursors = {};
var blocks = [];

function newBlock(position, wireframe, color)
{
	geometry = new THREE.CubeGeometry(200, 200, 200);
	material = new THREE.MeshLambertMaterial(
			{
				color: color,
				ambient: 0x000000,
				shading: THREE.FlatShading,
				wireframe: wireframe,
				wireframeLinewidth: 2.0
				});
	var block = new THREE.Mesh(geometry, material);
	block.position.x = position.x;
	block.position.y = position.y;
	block.position.z = position.z;
	return block;
}

function clearBlocks()
{
	for(i in blocks)
		scene.remove(blocks[i]);

	blocks = [];
}

function init()
{
	socket = io.connect(location.protocol + '//' + location.hostname + ':8080');
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 2000;

	scene = new THREE.Scene();

	mesh = newBlock({x: 0, y: 0, z:0}, true, 0xff0000);
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
			if(cursors[data.id] == undefined)
			{
				cursors[data.id] = newBlock(data.position, true, 0xffffff);
				scene.add(cursors[data.id]);
			}
			cursors[data.id].position = data.position;
			});

	socket.on('place', function(data){
			var block = newBlock(data.position, false); 
			blocks.push(block);
			scene.add(block);
			});

	socket.on('blocks', function(data){
			for(block in data)
				scene.add(newBlock(data[block].position, false));
			});

	socket.on('clear', function(data){
			clearBlocks();
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
			var block = newBlock(mesh.position, false); 
			blocks.push(block);
			scene.add(block);
			socket.emit('place', {position: mesh.position});
			});

		$('#clearBlocksButton').click(function(){
			if(confirm("Are you sure you want to delete all the blocks?"))
			{
				socket.emit('clear', {});
				clearBlocks();
			}
			});

		$(window).resize(function(){
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
			});

		init();
		animate();
});

