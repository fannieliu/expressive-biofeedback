var delta, theta, alpha, beta, gamma

var my_config = {
    count:                     200,
    shape:                     "lines",
    radiusInnerMax:            "0%",
    radiusInnerMin:            "0%",
    radiusOuterMax:            "48%",
    radiusOuterMin:            "48%",
    thicknessMin:              1,
    thicknessMax:              1,
    fadeTime:                  0.3,
    rotationVelMin:            0.05,
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

function getSwirlConfig() {
    return my_config;
}

var seconds = ((new Date().getTime() / 1000)%10)*100;

// CanvasSwirl 0.8 by Andrew Stibbard: http://xhva.net  http://jsswirl.com
function doSwirling() {
    // my_config.count = 0;
    var conf = getSwirlConfig();
    swirl1 = new CanvasSwirl(
        document.getElementById('swirl1_surface'), conf
    );
    setInterval(function() {
        updateSwirl(conf, delta, theta, alpha, beta, gamma);
        swirl1.applyConfig(conf);
    }, 1000);
};

function updateSwirl(config, newDelta, newTheta, newAlpha, newBeta, newGamma){
    // config.count = newBeta*350+150;
    config.count = newBeta*250+50;
    config.rotationVelMax = .8*(1-newDelta);
    config.rotationVelMin = Math.max(0.2, config.rotationVelMax-0.3);
    config.distanceJitterMax = Math.max(0,(1-newAlpha)*15-5);
    // config.hueMax = 30+(600*newDelta);
    //config.hueIncrement = 1+4*newDelta;
    // config.saturationMax = 90-(newDelta*50)
    /*
    config.count = newBeta*350+150;
    config.rotationVelMax = .2+.8*(newGamma);
    config.hueMax = 30+(600*newTheta);
    config.hueIncrement = 1+4*newTheta;
    config.saturationMax = 90-(newDelta*50);*/
};
