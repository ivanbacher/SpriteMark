'use strict';

angular.module('bunnyMarkApp')
  .directive('ngThreejs', function ($window) {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function (scope, element, attrs) {
        
        element.css('position', 'absolute')
        /*
        element.css('width', '100%');
        element.css('height', '100%');
        element.css('background', '#b2b2b2');
        element.css('display', 'block');
        */
        element.css('top','0');
        element.css('bottom','0');
        element.css('left','0');
        element.css('right','0');
        
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
 

        init();
        animate();
        addCube();
 
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
        }
 
        function onWindowResize(event) {
          
          var w = element.width();
          var h = element.height();
          
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        }
 
        function animate() {
            requestAnimationFrame(animate);
            render();
        }
 
        function render() {
          stats.update();
          renderer.render(scene, camera);
        }
        
        function addCube() {
          var geometry = new THREE.BoxGeometry(1,1,1);
          var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
          var cube = new THREE.Mesh( geometry, material );
          scene.add( cube ); 
        }
        
      }
    };
  });