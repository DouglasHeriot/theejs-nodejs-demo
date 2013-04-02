
var camera, scene, renderer;
var geometry, material, mesh;
var ambient;
var controls;
var socket;
var cursors = {};
var blocks = [];

function newBlock(position, scale, wireframe, color)
{
	geometry = new THREE.CubeGeometry(scale.x*100, scale.y*100, scale.z*100);
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

	mesh = newBlock({x: 0, y: 0, z:0}, {x: 1, y: 1, z: 1}, true, 0xff0000);
    
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
				cursors[data.id] = newBlock(data.position, data.scale, true, 0xffffff);
				scene.add(cursors[data.id]);
			}
			cursors[data.id].position = data.position;
			cursors[data.id].scale = mesh.scale;               
            });
    
    socket.on('blockSize', function(data){
        if(cursors[data.id] == undefined)
        {
            cursors[data.id] = newBlock(data.position, data.scale, true, 0xffffff);
            scene.add(cursors[data.id]);
        }
        cursors[data.id].position = data.position;
        cursors[data.id].scale = data.scale;
        });

	socket.on('place', function(data){
			var block = newBlock(data.position, data.scale, false); 
			blocks.push(block);
			scene.add(block);
			});

	socket.on('blocks', function(data){
			for(block in data)
			{
				var theNewBlock = newBlock(data[block].position, data[block].scale, false);
				blocks.push(theNewBlock);
				scene.add(theNewBlock);
			}
			});

	socket.on('clear', function(data){
			clearBlocks();
			});
			
			
	//New section for chatWindow
	socket.on('connect', function(){
		socket.emit('newUser', prompt("Please enter the name that you would like to identify you in the chat window"));
	});
	
	socket.on('updateChat', function(username, message){
		$('#chatWindow').append(username+":>" + " " + message +"\n");
	});
	//End new section for chatWindow
			
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
			socket.emit('move', {position: mesh.position, scale: mesh.scale});
			});
		$('#sliderY').change(function(){
			mesh.position.y = this.valueAsNumber;
			socket.emit('move', {position: mesh.position, scale: mesh.scale});
			});
		$('#sliderZ').change(function(){
			mesh.position.z = this.valueAsNumber;
			socket.emit('move', {position: mesh.position, scale: mesh.scale});
			});
		$('#sliderSize').change(function(){
            mesh.scale.x = this.valueAsNumber;
            mesh.scale.y = this.valueAsNumber;
            mesh.scale.z = this.valueAsNumber;
            socket.emit('blockSize', {position: mesh.position, scale: mesh.scale});
			});   
		$('#placeBlockButton').click(function(){
			var block = newBlock(mesh.position, mesh.scale, false); 
			blocks.push(block);
			scene.add(block);
			socket.emit('place', {position: mesh.position, scale: mesh.scale});
			});
		$('#lotsOfBlocks').click(function(){
			for(var i = 0; i < 100; i++)
			{
				var max = 1000;
				mesh.position.x = Math.random() * max*2 - max/2;
				mesh.position.y = Math.random() * max*2 - max/2;
				mesh.position.z = Math.random() * max*2 - max/2;
				mesh.position.scale = Math.random() * 2;

				var block = newBlock(mesh.position, mesh.scale, false); 
				blocks.push(block);
				scene.add(block);
				socket.emit('place', {position: mesh.position, scale: mesh.scale});
			}
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

		//New section for chatWindow
		
		//When the user clicks the send button
		$('#send').click(function(){
		
			//Get the message from the text field
			var message = $('#message').val();
			
			//Reset the text field to empty
			$('#message').val('');
			
			//Send the server the newMessage command along with the message
			socket.emit('newMessage', message);
			
			//Re-focus on the textarea
			$('#message').focus();
		});
		
		//Send the data when the user presses enter as well, more natural this way
		$('#message').keypress(function(e) {
			if(e.which == 13) {
				$('#send').focus().click();
				$(this).focus();
			}
		});
		//End new section
		
		
		$(window).resize(function(){
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( window.innerWidth, window.innerHeight );
			});

		init();
		animate();
});

