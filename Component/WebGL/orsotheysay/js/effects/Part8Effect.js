var Part8Effect = function ( camera, renderer ) {

	Effect.call( this );

	// Init

	var scene1, scene2, scene3,
	particle, mesh, material;

	scene1 = new THREE.Scene();
	scene2 = new THREE.Scene();
	//scene3 = new THREE.Scene();

	particle = new THREE.Particle( loadImage( new THREE.ParticleBitmapMaterial(), '../Component/WebGL/orsotheysay/files/textures/nebula.png' ) );
	particle.position.x = - 400;
	particle.position.z = - 800;
	particle.scale.x = particle.scale.y = 6;
	scene1.addObject( particle );

	//particle = new THREE.Particle( loadImage( new THREE.ParticleBitmapMaterial(), '../Component/WebGL/orsotheysay/files/textures/atmosphere.png' ) );
	//particle.scale.x = particle.scale.y = 0.52;
	//scene1.addObject( particle );

	for (var i = 0; i < 1024; i++) {

		particle = new THREE.Particle( new THREE.ParticleCircleMaterial( 0xffffff, Math.random() * 0.5 + 0.5 ) );
		particle.position.x = Math.random() * 4000 - 2000;
		particle.position.y = Math.random() * 4000 - 2000;
		particle.position.z = Math.random() * 4000 - 2000;
		particle.scale.x = particle.scale.y = Math.random() + 2;
		scene2.addObject( particle );
	}
    

	//mesh = new THREE.Mesh( new Sphere( 200, 20, 20 ), loadImage( new THREE.MeshBitmapUVMappingMaterial(), '../Component/WebGL/orsotheysay/files/textures/earth.jpg' ) );
	//scene2.addObject( mesh );
    
    //mesh.scale.x = mesh.scale.x * 0.25;
    //mesh.scale.y = mesh.scale.y * 0.25;

	//particle = new THREE.Particle( loadImage( new THREE.ParticleBitmapMaterial(), '../Component/WebGL/orsotheysay/files/textures/atmosphere2.png' ) );
	//particle.scale.x = particle.scale.y = 0.57;
	//scene3.addObject( particle );

	//

	function loadImage( material, path ) {

		var image = new Image();

		image.onload = function () {

			material.bitmap = this;

		};

		image.src = path;
        material.bitmap = image;

		return material;

	}

	// 

	this.show = function () {

		

	};

	this.update = function ( time ) {

		//mesh.rotation.y = time * 0.5 + 2;

		renderer.clear();
		renderer.domElement.getContext( '2d' ).globalCompositeOperation = 'lighter';
		renderer.render( scene1, camera );
		
        renderer.domElement.getContext( '2d' ).globalCompositeOperation = 'source-over';
		renderer.render( scene2, camera );
		
        /*
        renderer.domElement.getContext( '2d' ).globalCompositeOperation = 'lighter';
		renderer.render( scene3, camera );*/
	};

};


Part8Effect.prototype = new Effect();
Part8Effect.prototype.constructor = Part8Effect;
