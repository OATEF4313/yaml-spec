(function() {
  window.PlayGround = (function() {
    function PlayGround() {}

    PlayGround.refparser_events = function(text) {
      var parser;
      parser = new Parser(new TestReceiver);
      parser.parse(text);
      return parser.receiver.output();
    };

    PlayGround.yamlpp_events = function(text) {
      return this.localhost_server(text, 'cmd=perl-pp-event');
    };

    PlayGround.yamljs_events = function(text) {
      return this.localhost_server(text, 'cmd=js-yaml-event');
    };

    PlayGround.pyyaml_events = function(text) {
      return this.localhost_server(text, 'cmd=py-pyyaml-event');
    };

    PlayGround.libfyaml_events = function(text) {
      return this.localhost_server(text, 'cmd=c-libfyaml-event');
    };

    PlayGround.libyaml_events = function(text) {
      return this.localhost_server(text, 'cmd=c-libyaml-event');
    };

    PlayGround.localhost_server = function(text, args) {
      var data, e, env, loc, msg, port, resp, scheme;
      loc = window.location.href.replace(/#$/, '');
      if (window.location.href.match(/^https/)) {
        scheme = 'https';
        port = 31337;
        env = 1;
      } else {
        scheme = 'http';
        port = 1337;
        env = 0;
      }
      try {
        resp = $.ajax({
          type: 'POST',
          url: scheme + "://localhost:" + port + "/?" + args,
          data: {
            text: text
          },
          dataType: 'json',
          async: false
        });
      } catch (error) {
        e = error;
        throw 'Try: docker run -it --rm -p 31337:8000 yamlio/...';
      }
      if (resp.status === 200) {
        data = resp.responseJSON;
        if (data != null) {
          if (data.error != null) {
            throw data.error;
          }
          if (data.output != null) {
            return data.output;
          }
        }
      }
      console.dir(resp);
      msg = "This pane requires a localhost sandbox server.\nSimply run:\n\n$ docker run --rm \\\n    -p " + port + ":" + port + " \\\n    -e HTTPS=" + env + " \\\n    yamlio/playground-sandbox:0.0.2\n\non the same computer as your web browser.";
      if (scheme === 'https') {
        msg += "\n\n" + ("In a Google Chrome browser:\n\n* Open this internal URL: 'chrome:flags'\n* Search for '#allow-insecure-localhost'\n  * Enable it\n* Click the [Relaunch] button\n* Open " + scheme + "://localhost:" + port + "\n  * Accept the untrusted cert\n* Reload " + loc);
      }
      return msg;
    };

    return PlayGround;

  })();

}).call(this);
