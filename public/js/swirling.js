var delta, theta, alpha, beta, gamma

var my_config =
{ count:                     200,
  shape:                     "lines",
  radiusInnerMax:            "0%",
  radiusInnerMin:            "0%",
  radiusOuterMax:            "48%",
  radiusOuterMin:            "48%",
  thicknessMin:              1,
  thicknessMax:              1,
  fadeTime:                  0.3,
  rotationVelMin:            0.2,
  rotationVelMax:            0.4,
  originX:                   "center",
  originY:                   "center",
  originXOffsetMin:          0,
  originXOffsetMax:          0,
  originYOffsetMin:          0,
  originYOffsetMax:          0,
  distanceVelMin:            0.25,
  distanceVelMax:            0.6,
  saturationMin:             35,
  saturationMax:             85,
  lightnessMin:              30,
  lightnessMax:              75,
  hueMin:                    0,
  hueMax:                    360,
  hueIncrement:              1,
  opacityMin:                1,
  opacityMax:                1,
  opacityScaleAtCenter:      1,
  opacityScaleAtEdge:        1,
  opacityScaleIsRelative:    true,
  lightnessScaleAtCenter:    1,
  lightnessScaleAtEdge:      1,
  lightnessScaleIsRelative:  true,
  saturationScaleAtCenter:   1,
  saturationScaleAtEdge:     1,
  saturationScaleIsRelative: true,
  distanceJitterMin:         0,
  distanceJitterMax:         0,
  rotationJitterMin:         0,
  rotationJitterMax:         0
};

function getConfig() {
  return my_config;
}

function connectToMuse() {
  socket = io.connect();
  socket.emit('connectmuse');

  socket.on('muse_connected', function() {
    startSwirl();
    $('#musestatus').text('Muse successfully connected!');
  });

  socket.on('muse_uncertain', function() {
    $('#musestatus').text('Something is wrong with the Muse. Waiting for new signals...');
  });

  socket.on('muse_unintended_disconnect', function() {
    $('#musestatus').text('You were disconnected from the Muse! Try reconnecting.');
  })
}

function disconnectFromMuse() {
  socket.emit('disconnectmuse');

  socket.on('muse_disconnect', function() {
    $('#musestatus').text('Muse has been disconnected. Outputting csv files.');
  });
}

var seconds = ((new Date().getTime() / 1000)%10)*100;

function startSwirl() {
  doSwirling();
  socket.on('delta_relative', function(data) {
    delta = data;
  });
  socket.on('theta_relative', function(data) {
    theta = data;
  });
  socket.on('alpha_relative', function(data) {
    alpha = data;
  });
  socket.on('beta_relative', function(data) {
    beta = data;
  });
  socket.on('gamma_relative', function(data) {
    gamma = data;
  });
};

// CanvasSwirl 0.8 by Andrew Stibbard: http://xhva.net  http://jsswirl.com
function doSwirling() {
  myconfig.count = 0;
  swirl1 = new CanvasSwirl(
      document.getElementById('swirl1_surface'), my_config);
  setInterval(function() {
    updateSwirl(my_config, delta, theta, alpha, beta, gamma);
    swirl1.applyConfig(my_config);
  },1000);
};

function updateSwirl(config, newDelta, newTheta, newAlpha, newBeta, newGamma){
  config.count = newBeta*350+150;
  config.rotationVelMax = .2+.8*(newGamma);
  config.distanceJitterMax = max(0,(newAlpha)*15-1);
  config.hueMax = 30+(600*newTheta);
  config.hueIncrement = 1+4*newTheta;
  config.saturationMax = 90-(newDelta*50);
};
