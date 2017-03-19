var page = require('webpage').create();

var system = require('system');
var args = system.args;

if (args.length !== 2) {
  console.log('Usage: paratool <string>');
}

page.onError = function() {
};

page.onResourceRequested = function(requestData, networkRequest) {
  var match = requestData.url.match(/.(png|jpg|jpeg|ttf|gif)$/g);
  if (match) {
    networkRequest.cancel();
  }
};

function wait(test, cb) {
  var elapsed = 0;
  var ival;
  ival = setInterval(function() {
    if (test()) {
      clearInterval(ival);
      cb(null);
    } else {
      elapsed++;
      if (elapsed > 50) {
        clearInterval(ival);
        cb('operation timeout');
      }
    }
  }, 100);
}

function firstPageLoaded(err) {
  if (err) {
    exit(1);
  }
  var challenge = page.evaluate(function() {
    return document.getElementById('math_captcha_equation').value;
  });
  challenge = challenge.replace(/zero/g, '0');
  challenge = challenge.replace(/one/g, '1');
  challenge = challenge.replace(/two/g, '2');
  challenge = challenge.replace(/three/g, '3');
  challenge = challenge.replace(/four/g, '4');
  challenge = challenge.replace(/five/g, '5');
  challenge = challenge.replace(/six/g, '6');
  challenge = challenge.replace(/seven/g, '7');
  challenge = challenge.replace(/eight/g, '8');
  challenge = challenge.replace(/nine/g, '9');
  challenge = challenge.replace(/plus/g, '+');
  challenge = challenge.replace(/minus/g, '-');
  try {
    var out = eval(challenge);
  } catch (e) {
    exit(1);
  }
  page.evaluate(function(out, input) {
    document.getElementById('math_captcha_answer').value = out;
    document.getElementById('formNameLabelTextBefore').value = input;
    var form = document.getElementsByTagName('form')[0];
    form.submit();
  }, out, args[1]);
  wait(function() {
    return page.evaluate(function() {
      var outField = document.getElementById('math_captcha_answer');
      return !!outField && !outField.value;
    });
  }, submitted);
}

function submitted(err) {
  if (err) {
    exit(1);
  }
  var out = page.evaluate(function() {
    return document.getElementById('formNameLabelTextAfter').value;
  });
  if (!out) {
    exit(1);
  }
  console.log(out);
  exit(0);
}

function exit(code) {
  page.close();
  setTimeout(function() {
    phantom.exit(code)
  }, 0);
}

page.open('http://paraphrasing-tool.com', function (status) {
  if (status !== "success") {
    console.log("Unable to access network");
    exit(1);
  } else {
    wait(function() {
      return page.evaluate(function() {
        var el = document.getElementById('math_captcha_equation');
        return !!el && !!el.value;
      });
    }, firstPageLoaded);
  }
});
