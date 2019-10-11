
let sketch = new Sketch({
	duration: 2,
	debug: true,
	uniforms: {
		// width: {value: 0.35, type:'f', min:0., max:1},
	},
	fragment: `
		uniform float time;
		uniform float progress;
		uniform float width;
		uniform float scaleX;
		uniform float scaleY;
		uniform float transition;
		uniform float radius;
		uniform float swipe;
		uniform sampler2D texture1;
		uniform sampler2D texture2;
		uniform sampler2D displacement;
		uniform vec4 resolution;

		varying vec2 vUv;
		varying vec4 vPosition;
		vec2 mirrored(vec2 v) {
			vec2 m = mod(v,2.);
			return mix(m,2.0 - m, step(1.0 ,m));
		}
		float parabola( float x, float k ) {
		  return pow( 4. * x * ( 1. - x ), k );
		}

		void main()	{
		  vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
		  vec2 p = newUV;
		  vec2 start = vec2(0.5,0.5);



		  vec2 uv = newUV;
		  float dt = parabola(progress, 1.);
		  vec4 noise = texture2D(displacement, mirrored(vUv+time*0.04));
		  float prog = progress + noise.g * 0.06;
		  float intpl = pow(abs(smoothstep(0., 1., (prog*2. - uv.x))), 10.);
		  
		  vec4 t1 = texture2D( texture1, (uv - 0.5) * (1.0 - intpl) + 0.5 ) ;
		  vec4 t2 = texture2D( texture2, (uv - 0.5) * intpl + 0.5 );
		  gl_FragColor = mix( t1, t2, intpl );

		}

	`
});


