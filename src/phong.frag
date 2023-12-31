//=============================================================================
//
//   Exercise code for the lecture "Introduction to Computer Graphics"
//     by Prof. Mario Botsch, Bielefeld University
//
//   Copyright (C) by Computer Graphics Group, Bielefeld University
//
//=============================================================================

#version 140

in vec3 v2f_normal;
in vec2 v2f_texcoord;
in vec3 v2f_light;
in vec3 v2f_view;

out vec4 f_color;

uniform sampler2D tex;
uniform bool greyscale;

const float shininess = 8.0;
const vec3  sunlight = vec3(1.0, 0.941, 0.898);

void main()
{   
    vec3 color = vec3(0.0,0.0,0.0);

    //calculate the direciton of the sun
    vec3 light_dir = normalize(v2f_light);
    //get the texel of planet texture
    vec3 sampled_tex = vec3(texture(tex,v2f_texcoord));
    
    //normal phong model
    vec3 ambient = vec3(sampled_tex) * 0.2 * sunlight;
    vec3 diffuse = max(dot(v2f_normal,normalize(v2f_light)),0) * vec3(sampled_tex) * sunlight;
    float spec = pow(max(0, dot(reflect(-light_dir,v2f_normal),
        normalize(vec3(0,0,1)))),shininess);
    vec3 specular = dot(v2f_normal,v2f_light) >= 0 
        ? sunlight * sampled_tex * spec
        : vec3(0);
    
    //add everything together...
    color = ambient + diffuse + specular;

    // convert RGB color to YUV color and use only the luminance
    if (greyscale) color = vec3(0.299*color.r+0.587*color.g+0.114*color.b);

    // add required alpha value
    f_color = vec4(color, 1.0);
}
