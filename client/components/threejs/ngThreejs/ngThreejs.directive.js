'use strict';

angular.module('SpriteMarkApp')
  .directive('ngThreejs', function ($window, $interval) {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function (scope, element, attrs) {
        
        element.css('position', 'absolute')
        element.css('top','0');
        element.css('bottom','0');
        element.css('left','0');
        element.css('right','0');
        element.css('background', '#b2b2b2');
        
        var BunnyFactory = function() {
          
          var bunnyTexture = THREE.ImageUtils.loadTexture( 'assets/images/wabbit_alpha.png' );
          var bunnyMaterial = new THREE.SpriteMaterial( { map: bunnyTexture, useScreenCoordinates: false } );
          var scale = 0.5;
          this.makeBunny = function() {
            
            var bunny = new THREE.Sprite( bunnyMaterial );
            bunny.name = 'bunny';
            bunny.scale.set( scale, scale, 0 );
            
            if(getRandomInt(0,1) === 0) {
              bunny.userData.goingLeft = false;
              bunny.userData.goingUp = true;
            } else 
            if (getRandomInt(0,1) === 1) {
              bunny.userData.goingLeft = true;
              bunny.userData.goingUp = false;
            }
                    
            return bunny;
          }

        }
        var cameraBoundingBox = {}        
        /* parameters */
        var params = {};
        params.debug = attrs.debugMode || 'false';
                
        var camera;
        var scene;
        var renderer;
        var previous;
        var stats;
        var cameraBoundingBox;
        var clock = new THREE.Clock();
        var speed = 1;
        
        var bunnyFactory = new BunnyFactory();
        var bunnies = [];
        var bunnyInterval;
                 
        
        init();
        animate();
        calcCameraBoundingBox();
        placeRandomBunnies(1000);
 
        function init() {
          var width = element.width();
          var height = element.height();
          
          camera = new THREE.PerspectiveCamera(50, width / height, 1, 2000);
          camera.position.set(0, 0, 40);
          scene = new THREE.Scene();
            
          // Renderer
          renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
          renderer.setSize(width, height);
          element[0].appendChild(renderer.domElement);
          
          //stats
          stats = new Stats();
          stats.domElement.style.position = 'absolute';
          stats.domElement.style.left = '0px';
          stats.domElement.style.top = '0px';
          element[0].appendChild( stats.domElement );

          // Events
          $window.addEventListener('resize', onWindowResize, false);
          
          element.on('mousedown', onMouseDown);
          element.on('mouseup', onMouseUp);
        }
        
        //events
        function onWindowResize(event) {
          
          var w = element.width();
          var h = element.height();
          
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          calcCameraBoundingBox();
        }
        
        function onMouseDown(event) {
          
          bunnyInterval = $interval( function(){
            addBunnyToScene();
          },30);
        }
        
        function onMouseUp(event) {
          
          if(bunnyInterval) {
            $interval.cancel(bunnyInterval);
          }
        };
 
        function animate() {
            requestAnimationFrame(animate);
            render();
        }
 
        function render() {
          stats.update();
          bunnyUpdate(clock.getDelta());
          renderer.render(scene, camera);
        }
        
        function addCube() {
          var geometry = new THREE.BoxGeometry(1,1,1);
          var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
          var cube = new THREE.Mesh( geometry, material );
          cube.position.set(0,cameraBoundingBox.y,0);
          scene.add( cube ); 
        }
        
        function getRandomInt(min, max) {
          return Math.round(Math.random() * (max - min + 1)) + min;
        }
        
        function addBunnyToScene() {
          
          var b = bunnyFactory.makeBunny();
          b.position.set(getRandomInt(-cameraBoundingBox.x,cameraBoundingBox.x),getRandomInt(-cameraBoundingBox.y,cameraBoundingBox.y),0);
          bunnies.push(b);
          scope.bunnyCount = bunnies.length;          
          scene.add( b );
        }
        
        function placeRandomBunnies(amount) {
          
          for(var i = 0; i < amount; i++) {
            var b = bunnyFactory.makeBunny();
            b.position.set(getRandomInt(-cameraBoundingBox.x,cameraBoundingBox.x),getRandomInt(-cameraBoundingBox.y,cameraBoundingBox.y),0);
            bunnies.push(b);
            scene.add( b );
          }
          scope.bunnyCount = bunnies.length;
        }
        
        function bunnyUpdate( delta ) {
        
          for(var i = 0; i < bunnies.length; i++) {
            
            var b = bunnies[i];
            
            if(b.userData.goingUp) {
              
              b.position.y += speed * delta;
              
            } else {
              b.position.y -= speed * delta;
            }
            
            if(b.userData.goingLeft) {
              
              b.position.x -= speed * delta;
              
            } else {
              b.position.x += speed * delta;
            }
            
            //check bounds
            if(b.position.x > cameraBoundingBox.x ) {
              b.userData.goingLeft = true;
            }
            if(b.position.x < -cameraBoundingBox.x) {
              b.userData.goingLeft = false;
            }
            
            if(b.position.y > cameraBoundingBox.y ) {
              b.userData.goingUp = false;
            }
            if(b.position.y < -cameraBoundingBox.y) {
              b.userData.goingUp = true;
            }
          }
        }
        
        function cameraHeight() {
          var dist = camera.position.z;
          var vFOV = camera.fov * Math.PI / 180;
          var height = 2 * Math.tan( vFOV / 2 ) * dist;
          return height;
        }
        
        function cameraWidth() {
          var height = cameraHeight();
          var aspect = element.width() / element.height();
          var width = height * aspect;
          return width;
        }
        
        function calcCameraBoundingBox() {
          cameraBoundingBox.x = cameraWidth()/2;
          cameraBoundingBox.y = cameraHeight()/2;
          console.log(cameraBoundingBox);
        }
        
      }
    };
  });