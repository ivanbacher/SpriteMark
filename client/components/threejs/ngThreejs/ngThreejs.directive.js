'use strict';

angular.module('bunnyMarkApp')
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
          
          this.makeBunny = function() {
            
            var bunny = new THREE.Sprite( bunnyMaterial );
            bunny.name = 'bunny';
            bunny.userData.goingUp = false;
            bunny.userData.goingLeft = false;
            bunny.name = 'bunny';
            bunny.scale.set( 0.2, 0.2, 0.2 );
                    
            return bunny;
          }

        }
                
        /* parameters */
        var params = {};
        params.debug = attrs.debugMode || 'false';
        
        var width = element.width();
        var height = element.height();
        
        var camera;
        var scene;
        var renderer;
        var previous;
        var stats;
        
        var bunnyFactory = new BunnyFactory();
        var bunnies = [];
        var bunnyInterval;
                 
        
        init();
        animate();
        placeRandomBunnies(400);
 
        function init() {
          camera = new THREE.PerspectiveCamera(50, width / height, 1, 2000);
          camera.position.set(0, 0, 5);
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
        }
        
        function onMouseDown(event) {
          
          bunnyInterval = $interval( function(){
            addBunnyToScene();
            console.log('Bunny added');
            console.log('There are now: ' + bunnies.length + ' bunnies on screen');
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
          bunnyUpdate();
          renderer.render(scene, camera);
        }
        
        function addCube() {
          var geometry = new THREE.BoxGeometry(1,1,1);
          var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
          var cube = new THREE.Mesh( geometry, material );
          scene.add( cube ); 
        }
        
        function getRandomInt(min, max) {
          return Math.round(Math.random() * (max - min + 1)) + min;
        }
        
        function addBunnyToScene() {
          
          var b = bunnyFactory.makeBunny();
          b.position.set(getRandomInt(-10,10),getRandomInt(-10,10),0);
          bunnies.push(b);
          scene.add( b );
        }
        
        function placeRandomBunnies(amount) {
          
          for(var i = 0; i < amount; i++) {
            var b = bunnyFactory.makeBunny();
            b.position.set(getRandomInt(-10,10),getRandomInt(-10,10),0);
            bunnies.push(b);
            scene.add( b );
          }
        }
        
        function bunnyUpdate() {
        
          for(var i = 0; i < bunnies.length; i++) {
            
            var b = bunnies[i];
            
            if(b.userData.goingUp) {
              
              b.position.y += 0.05;
              
            } else {
              b.position.y -= 0.05;
            }
            
            if(b.userData.goingLeft) {
              
              b.position.x -= 0.025;
              
            } else {
              b.position.x += 0.025;
            }
            
            //check bounds
            if(b.position.y > 3 ) {
              b.userData.goingUp = false;
            }
            if(b.position.y < -3) {
              b.userData.goingUp = true;
            }
            
            if(b.position.x > 4 ) {
              b.userData.goingLeft = true;
            }
            if(b.position.x < -4) {
              b.userData.goingLeft = false;
            }
          }
        }
        
        
        
      }
    };
  });