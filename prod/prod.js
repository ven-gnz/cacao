/* -*- mode: javascript; tab-width: 4; indent-tabs-mode: nil; -*- */



/*
The visuals of this production are synced to the following song
created using the great SoundBox minisynth:

http://sb.bitsnbites.eu/?data=U0JveAwC7dm9SsNQGMbx56RpBoeqizgGexWCuzeiWIoSxBIIRcwSQmiQlCKIeCdOjl6Nl6AnX5Dix5zo_5e-73vaLCfhTH1OD6SJfNc5izV6i2Ud7tp27BnnVc5040V2NXI9W3Z6jqNAS6Wdnm31lfouCL7f_6qat7rv-f6vFCnp9HSrZ71__7PZQrEWzYyrab9pHobzKEmivu__Qje66_RrndtT0_ZwwOd_qVyPX85_0cy1rY0AAAAAAAAAAPibulHZvtqoTH4ZlUmmuhrPT3oY8qPW-y__-C-qWKBYK1cZ8WVEAQAAAAAAAAAAAP_Sx8LYkpHrTetfnInkt7dNqV6m9vNb8S4BAAAAAAAAAAAwLHldJ-7OkV29jGXeU_mX4z23vGuarKxqZRr2Q6UkZQAAAAAAAAAAABiWTw

One older version, as an example of "keeping track of your song versions":

http://sb.bitsnbites.eu/?data=U0JveAwC7dk9SgNBGAbgd2MS0MKfSsvFnELwOJZCGhsRJN0SEiQhCCLexMrS03gE3c0aiKLWRp9n-L4ZdqaY2fa9Pky2U3Y7Z6NsPY9SO9qr20m_6DylM1j0L-tVO5JhrlKt9fGHPslvNxx-ff9J3ae5y82n87P3eV7XIgAAAAAAAPw16ynZQVYpWcomJUuK5Uge7nO7ya9s799kXrNlIjabZ5om3RtLwQAAAAAAAP6l14uirhTp9gftl85uUq62i0aqpPqp_EYAAAAAAAA2y7St0-7Ocb167KV4qVKe9_a7zW7RxmTLIOybqoRkAAAAAAAAbJY3

*/

// ----------------------------------------------------------------------------
// Global variables that you MUST define - they are used by the library code:

/** Song tempo; the library computes time in beats for easy sync. */
var songBeatsPerMinute = 116;

/** 
 * Frame producer function must be selected; this tutorial example depends on
 * the exact selection done here. In fact, everything after this selection could
 * be very different for different approaches of how to paint each graphics frame.
 *
 * TODO: In the future (maybe not yet in 2024) there could be a larger selection
 * of "demo type" choices here. So far there is the classic adaptation of course
 * exercise answers: You provide a scenegraph with objects, camera, and light.
 * The frame producer function traverses the graph and puts stuff to screen.
 */
var frameProducerFunction = frameProducerVanilla14;

/**
 * Shader selection; this tutorial example depends on the exact ones selected.
 * You better know what you do, if you change these. That said, why not ... The
 * library compiles the combination of shaders given here and uses that as the
 * shader program for everything that you draw.
 *
 * TODO: (Probably after 2024) This is related to the "demo type" choices which
 * I'd like to provide in the library. So far let's have one simple one: It has
 * a Phong shading model with exactly one light source. No white fog this year..
 */
var shaders = [vert_shader_vanilla14, frag_shader_vanilla14];

/** You must give an RGBA color; scene background is cleared by the library.*/
var clearColor = [0,0,0,1];

// ----------------------------------------------------------------------------
// Global variables that belong to your own production - the library does not
// use these, so you can change or add whatever you want here. They need to be
// global so they are available in your draw function below:

var objTile, objBackground, objBall;

// ----------------------------------------------------------------------------
/**
 * Initialize the constant and pre-computed "assets" used in your own
 * production; the library calls this function once before entering the main
 * loop.
 *
 * Things like graphics primitives / building blocks can be generated
 * here. Basically anything that you want to compute once, before the
 * show starts. Due to the current library workings, this includes all
 * shapes that you're going to use - modifying shapes on-the-fly is not
 * yet supported.
 */
function initAssets(){
    // The library provides some elementary ways to create shapes, as per
    // the MIT OCW first course in computer graphics that was its inspiration.
    // Once a shape is created, any number of transformed copies can be placed
    // in the scene.

    // Here, we create the most elementary of the elementary building blocks as
    // an example: the box and the ball.

    // Now there is a box shape available in the library:
    objTile = new Box(1);

    // Ball can be built from circle curves:
    objBall = new GenCyl(new funCircle(1,10,.5), 32,
                         new funCircle(0,32));

    // Can make the radius negative to make an interior of a ball:
    objBackground = new GenCyl(new funCircle(-10,10,.5), 32,
                               new funCircle(0,32));

}


    /**
     * Example of a scene graph node. If you have any experience with JSON,
     * you'll get it that a node is and object with 3 properties named "f", "o",
     * and "c", and they all are lists. If this is your first encounter, you
     * learn some basic JSON syntax here. Ask your tutor to clarify.
     *
     * The names are short and carefully selected to have minimal footprint in a
     * demoscene intro. Here is the semantics and some mnemonics to help you
     * remember what they mean:
     *
     *   "f" stands for Frame transformations or Functions: a list of 4x4
     *   matrices that are right-multiplied to current scene transformation
     *   matrix before entering the node further.
     *
     *   "o" stands for Objects: a list of actual objects / shapes that are
     *   drawn using the current transformation, after applying all "f".
     *
     *   "c" stands for Children: a list of nodes that will be processed after
     *   applying "f" and drawing "o". If you have been wondering what recursive
     *   processing means, then here is a good example about it.
     *
     * The current library version uses property "r" for special uses, but it is
     * not mandatory, and will be explained later, on a need-to-know basis.
     */

    var clr =
    [ .1,  .12, .05, 1, // ambient
      .2,  .4,  .5,  1, // diffuse
      .1,  .1,  .1,  1, // specular + shininess
       0,   0,   0,  0  // control
    ];

    var elbowRot = 0;

function person(t){


    var person = {
        f : [],
        o: [],
        c: []
    };

    var sternum = {
        f : [scale_wi(0.2),translate_wi(0,4,0)],
        o : [new Material(clr), objBall],
        c : []
    };

    var leftShoulder = {
        f: [translate_wi(2,0,0)],
        o: [new Material(clr), objBall],
        c: []
    };

    
    elbowRot = 2*Math.sin(0.5*t) > 0.1 ? 2*Math.sin(0.5*t) : 0.1;

    var elbow = {
        f: [translate_wi(0,-3,0), rotX_wi(elbowRot)],
        o: [new Material(clr), objBall],
        c: []
    };

    var wrist = {
        f : [translate_wi(0,-3, 0)],
        o: [new Material(clr), objBall],
        c: [] };


    elbow.c.push(wrist);
    leftShoulder.c.push(elbow);

    var rightShoulder = {
        f: [translate_wi(-1,0,0)],
        o: [new Material(clr),objBall],
        c: []
    };

    sternum.c.push(leftShoulder);
    sternum.c.push(rightShoulder);
    
    person.c.push(sternum);

    return person;
}

/** 
 * Example of a function that returns a diffuse non-shiny basic coloring
 * compatible with the Vanilla 1.4 shader
 */
function basic_color(r,g,b){
    return [r/3, g/3, b/3, 0,
            r,   g,   b,   0,
            0,   0,   0,   1,
            0,   0,   0,   0]
}

/**
 * Your own creative "direction" happens here - this function will be called on every
 * screen update.
 *
 * You are expected to return a scene graph for any time step here.
 * Time is given as 'beats' according to song tempo that you have set above.
 *
 * This is an important function to re-write creatively to make your own entry.
 * 
 * You can start deleting and replacing parts of the example as soon as you start to
 * get an idea of how the structure is built. Exploring with small changes is a recommended
 * way of learning. You can also talk you a workshop tutor and explore the possibilities
 * available - they are limited, but can still be put together in a million ways or more.
 *
 */
function buildSceneAtTime(t){

    // Initialize empty scenegraph. Root node with nothing inside:
    var sceneroot = {f:[],o:[],c:[]};

    // Build animated contents step by step, in subgraphs
    var person_one = person(2*t);
    var personnel = {f:[],o:[],c:[
        {f:[],  o:[], c:[person_one]}
    ]}

    // Colors can be animated, as can anything. Use "t" for sync and innovate...
    // Names can be given to any nuts or bolts, to help you animate and manage your scene:
    var personnel_location = [translate_wi(0,-15,0)];


    sceneroot.c.push({f:[],
                      o:[],
                      c:[
                              {f:personnel_location,
                               o:[],
                               c:[personnel]},
                                
                              // The scene must have exactly one Camera. It doesn't work without.
                              {f:[translate_wi(0,0,0), rotY_wi(t/3), translate_wi(0,0,45), rotX_wi(.2)],
                               o:[],
                               c:[],
                               r:[new Camera()]
                              },

                              // With "Vanilla 1.4" intro, the scene must have exactly one Light.
                              // It doesn't work without.
                              {f:[translate_wi(0, 0, 0), scale_wi(.1)],
                                o:[new Material(basic_color(9,9,9)), objTile],
                                c:[],
                                r:[new Light()]
                              }
                        ]
                    }
                    );

    return sceneroot;
}




/**
 * (Optionally) initialize additional HTML and CSS parts of the
 * document. This can be used, for example, for scrolling or flashing
 * text shown as usual HTML or hypertext. Not often used in actual
 * demoscene productions.
 */
function initDocument(){
}

/**
 * (Optionally) update the HTML and CSS parts of the document. This
 * can be used for scrolling or flashing text shown as usual HTML. Not
 * often used in actual demoscene productions.
 */
function updateDocument(t){
}
