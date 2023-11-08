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

uniform sampler2D day_texture;
uniform sampler2D night_texture;
uniform sampler2D cloud_texture;
uniform sampler2D gloss_texture;
uniform bool greyscale;

const float shininess = 20.0;
const vec3  sunlight = vec3(1.0, 0.941, 0.898);

void main()
{

    vec3 color = vec3(0.0,0.0,0.0);

    //calculate the direction of the sun
    vec3 light_dir = normalize(v2f_light);

    //get the texel of some textures 
    vec3 sampled_tex = vec3(texture(day_texture,v2f_texcoord));
    vec3 sampled_tex_night = vec3(texture(night_texture,v2f_texcoord));
    vec3 sampled_cloud = texture(cloud_texture,v2f_texcoord).rgb;
    float cloudiness = sampled_cloud.r;
    float glossiness = texture(gloss_texture,v2f_texcoord).r;

    //normal phong calculation:
    vec3 ambient = vec3(sampled_tex) * 0.2 * sunlight;
    float diff = max(dot(v2f_normal,normalize(v2f_light)),0) ;
    vec3 diffuse = diff * vec3(sampled_tex) * sunlight;
    float spec = pow(max(0, dot(reflect(light_dir,v2f_normal),
        normalize(v2f_view))),shininess);
    vec3 specular = dot(v2f_normal,v2f_light) >= 0 
        ? sunlight * glossiness * spec
        : vec3(0);
    
    //lambertian diffuse for "cloud day mix"
    vec3 cloud_ambient = vec3(sampled_cloud) * 0.2 * sunlight;
    float cloud_diff = max(dot(v2f_normal,normalize(v2f_light)),0);
    vec3 cloud_diffuse = diff * sampled_cloud * sunlight;
    
    //get the day color
    vec3 phong_day_color = ambient + diffuse + specular*(1-cloudiness);
    vec3 day_color = mix(phong_day_color,cloud_ambient+cloud_diffuse,cloudiness);

    //get the night color
    vec3 night_color = sampled_tex_night * (1-cloudiness);

    //mix them
    color = day_color * diff + (1-diff) * night_color;

    // convert RGB color to YUV color and use only the luminance
    if (greyscale) color = vec3(0.299*color.r+0.587*color.g+0.114*color.b);

    // add required alpha value
    f_color = vec4(color, 1.0);

}
