import React from 'react';

/**
 * SVG Component Library
 * 
 * This file provides utilities for transforming and rendering SVG elements as React components.
 * It includes:
 * - Functions to convert SVG strings into React elements while preserving styles and attributes
 * - A collection of reusable SVG components for speech bubbles and character heads
 * - Style transformation utilities to handle SVG styling in a React-compatible way
 * 
 * The SVG components are organized into categories:
 * - speech: Speech bubble variations
 * - heads: Character head variations with different expressions (happy, sad, etc.)
 * 
 * Each SVG is wrapped in a function that transforms it into a React element,
 * allowing for dynamic style overrides and proper React rendering.
 */


const toCamelCase = (str) => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

// Function to transform style string to React style object
const transformSvgStyle = (styleString, overrideStyles = {}, isHead = false) => {
    // Return override styles if no original style
    if (!styleString) return overrideStyles;

    // Parse the style string into key-value pairs
    const baseStyles = styleString
        .split(';')
        .filter(style => style.trim())
        .reduce((acc, style) => {
            const [property, value] = style.split(':').map(str => str.trim());
            const camelProperty = toCamelCase(property);


            if (camelProperty === 'fill' && value === "#aaaaaa" || value.startsWith("url(")) {
                acc[camelProperty] = 'currentColor';

            } else {
                acc[camelProperty] = value;
            }

            return acc;
        }, {});

    // Merge with override styles, letting overrides take precedence
    return { ...baseStyles, ...overrideStyles };
};

// Function to transform an SVG element and its children
const transformSvg = (svgString, styleOverrides = {}, isHead = false) => {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    // Function to process each element
    const processElement = (element) => {
        // Convert to React element
        const props = {};

        // Transform style if present
        const styleAttr = element.getAttribute('style');
        if (styleAttr || Object.keys(styleOverrides).length > 0) {
            props.style = transformSvgStyle(styleAttr, styleOverrides, isHead);
        }

        // Copy other attributes and convert fill/stroke to currentColor
        Array.from(element.attributes).forEach(attr => {
            if (attr.name !== 'style') {
                // Convert className for React
                const name = attr.name === 'class' ? 'className' : attr.name;
                props[name] = attr.value;
            }
        });

        // Process children with keys
        const children = Array.from(element.children).map((child, index) => {
            const processedChild = processElement(child);
            return React.cloneElement(processedChild, { key: `${child.tagName}-${index}` });
        });

        // Create React element
        return React.createElement(
            element.tagName.toLowerCase(),
            props,
            children.length ? children : element.textContent
        );
    };

    return processElement(svg);
};


export const SVGComponents = {
    speech: [
        () => transformSvg(`
<svg viewBox="0 0 300 300" >
  <g >
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M201.463,23.9376 C192.297,29.5781,190.53,48.1241,195.317,57.1741 C196.491,59.3943,198.559,62.099,200.438,63.7683 C201.653,64.8481,203.231,64.747,203.757,66.5571 C205.367,72.1011,199.249,78.9007,194.348,80.6597 C201.334,83.7872,207.363,78.0429,211.635,73.4355 C212.832,72.1443,213.734,69.213,215.477,68.6737 C218.726,67.6679,222.646,68.8429,225.929,69.1525 C230.973,69.6281,236.125,69.7896,241.189,69.7896"/>
  </g>
</svg> 
            `)
    ],
    heads: {
        happy: [
            // worm guy
            () => transformSvg(`
                <svg viewBox="0 0 300 300" >
                    <path id="Path" style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M140.728,84.643 C131.113,69.5574,132.489,49.3588,142.496,36.698 C158.229,16.7914,193.785,10.4468,205.287,40.3734 C208.976,49.9725,201.138,51.4967,195.212,51.9256 C187.627,52.4747,179.894,53.191,172.293,53.1635 C165.518,53.1389,159.673,52.4147,152.872,53.8225"/>
                    <path id="Path" style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M177.81,55.952 C182.248,66.3162,180.545,74.8448,176.438,84.7113"/>
                    <path id="Path" style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M140.731,83.2503 C144.003,84.7019,146.836,89.7789,150.912,89.9548 C159.681,90.3335,167.218,85.7673,175.891,84.7113"/>
                    <path id="Path" style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M175.891,42.4712 C175.891,42.4712,175.289,43.919,175.289,43.919"/>
                    <path id="Path" style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M193.896,42.498 C193.869,41.6781,197.091,42.3256,197.091,42.3256 C197.091,42.3256,193.922,43.3179,193.896,42.498 z"/>
                </svg>
            `),

            // Head phone guy 
            () => transformSvg(`
                <svg viewBox="0 0 300 300">
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M138.181,32.2068 C136.124,33.5402,135.443,35.4487,134.466,37.6687 C132.119,43,131.894,47.6735,132.218,53.4486 C132.516,58.7661,132.816,64.4009,135.087,69.3108 C138.73,77.1863,146.143,83.4236,153.854,87.085 C157.495,88.8137,160.783,90.1629,164.924,89.6303 C168.383,89.1855,171.406,87.1774,174.181,85.1875 C178.022,82.4339,180.607,77.6176,182.177,73.3023 C186.389,61.7229,186.023,44.1938,176.944,34.7574 C171.71,29.3175,161.603,24.9277,153.993,25.2581 C147.809,25.5266,141.005,28.3726,135.844,31.6102"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M153.637,72.0884 C159.135,72.1463,164.213,69.3917,169.615,69.3731"/>
                    <path  style="fill:#000000;fill-opacity:1;fill-rule:evenodd;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M151.035,52.7802 C151.607,52.7802,152.07,53.2671,152.07,53.8677 C152.07,54.4683,151.607,54.9552,151.035,54.9552 C150.463,54.9552,150,54.4683,150,53.8677 C150,53.2671,150.463,52.7802,151.035,52.7802 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M130.308,52.702 C127.604,51.013,122.914,51.9438,122.135,55.5653 C121.328,59.3177,122.36,62.12,124.799,64.9815 C125.807,66.1641,126.646,67.5796,128.342,67.6552 C130.488,67.7508,131.871,64.7908,132.491,63.1667 C134.123,58.8961,135.594,53.9765,130.308,52.702 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M126.954,51.9822 C125.113,46.8724,126.231,42.8112,127.828,37.859 C128.756,34.9822,128.459,31.5245,129.995,28.7978 C132.527,24.3032,137.776,21.3645,142.161,19.0929 C143.807,18.2404,144.715,16.9257,146.637,16.4916 C150.691,15.576,154.673,16.2643,158.714,16.067 C161.831,15.9148,165.322,14.4638,168.357,15.2335 C171.793,16.1047,173.452,18.4636,175.904,20.7515 C182.189,26.6141,187.299,34.1738,189.174,42.6472"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M189.763,49.5479 C190.111,51.1243,190.297,52.7082,190.216,54.3222 C190.195,54.7524,190.278,55.3466,190.839,55.3418 C193.451,55.3195,190.776,50.5906,189.763,49.5479 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M125.201,57.1622 C125.568,58.8893,125.962,60.4372,126.891,61.9569 C128.353,60.5757,126.503,58.166,125.201,57.1622 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M188.963,43.3968 C186.625,42.5393,185.328,45.0853,184.816,47.2394 C183.694,51.9559,183.726,62.0294,191.2,60.755 C196.539,59.8445,199.158,52.3404,196.897,47.8505 C194.863,43.8108,193.174,43.5966,188.963,43.3968 z"/>
                    <path  style="fill:#000000;fill-opacity:1;fill-rule:evenodd;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M166.481,50.7237 C167.11,50.7237,167.62,51.4275,167.62,52.2957 C167.62,53.1639,167.11,53.8677,166.481,53.8677 C165.852,53.8677,165.342,53.1639,165.342,52.2957 C165.342,51.4275,165.852,50.7237,166.481,50.7237 z"/>
                </svg>
            `),

            // Nerd guy
            () => transformSvg(`
                <svg viewBox="0 0 300 300">
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M162.144,28.4861 C156.414,25.6248,151.123,26.7969,145.4,28.9652 C133.803,33.359,123.079,45.9819,124.065,58.8864 C124.58,65.6191,128.839,71.4486,133.818,75.7113 C142.935,83.515,155.72,89.0791,167.955,86.7657 C180.074,84.4745,191.927,75.1235,192.099,61.8963 C192.175,56.1167,189.63,50.501,186.806,45.6107 C182.403,37.9837,177.608,32.2656,169.379,28.6093 C163.764,26.1145,159.961,24.5468,153.864,26.4359"/>
                    <path  style="fill:#c9ffff;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M134.636,46.3741 C135.724,43.4021,139.395,43.6134,142.242,43.4513 C145.858,43.2456,150.152,42.6383,153.682,43.6884 C157.228,44.7432,159.293,47.252,163.082,47.382 C164.828,47.4419,165.523,45.7368,167.071,45.295 C169.715,44.5407,172.826,44.8054,175.547,44.6853 C178.789,44.5423,182.173,44.5177,185.414,44.6675 C186.518,44.7185,188.003,45.1539,188.146,46.4317 C188.607,50.5376,187.258,54.7,186.954,58.8822 C186.839,60.4614,185.558,62.9287,184.313,64.0907 C181.678,66.5518,175.203,67.0533,171.808,66.8527 C166.609,66.5455,165.61,62.6523,165.11,57.9609 C165.004,56.9645,165.799,51.0474,165.784,50.0249 C165.721,45.5987,160.827,48.3702,159.742,48.365 C158.302,48.358,158.673,54.5066,158.595,55.5842 C158.386,58.4582,158.584,61.4467,156.455,63.5963 C154.614,65.4553,150.838,66.0307,148.12,66.2509 C147.028,66.3393,144.392,65.8844,143.34,65.1989 C141.561,64.0389,138.826,62.2537,137.336,60.6821"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M164.509,80.2436 C162.667,81.4455,160.382,82.9182,153.352,80.2456 C152.166,79.795,146.247,73.5289,146.718,72.2508 C148.455,72.8973,155.804,75.1185,157.63,75.2778 C163.28,75.7705,166.239,74.8243,170.907,71.3466"/>
                    <path  style="fill:#000000;fill-opacity:1;fill-rule:evenodd;opacity:1;stroke:none;" d="M151.698,51.6631 C152.637,51.6631,153.397,52.7341,153.397,54.0553 C153.397,55.3764,152.637,56.4474,151.698,56.4474 C150.76,56.4474,150,55.3764,150,54.0553 C150,52.7341,150.76,51.6631,151.698,51.6631 z"/>
                    <path  style="fill:#000000;fill-opacity:1;fill-rule:evenodd;opacity:1;stroke:none;" d="M179.922,51.6631 C180.731,51.6631,181.387,52.8721,181.387,54.3635 C181.387,55.8549,180.731,57.064,179.922,57.064 C179.113,57.064,178.457,55.8549,178.457,54.3635 C178.457,52.8721,179.113,51.6631,179.922,51.6631 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M131.106,47.8297 C132.578,47.4215,133.987,46.5917,135.534,46.7027 C131.183,48.497,127.294,49.5815,123.632,52.818 C127.687,51.1233,129.623,47.856,134.615,48.4797 C134.413,51.2609,133.987,56.7038,135.761,58.9738 C136.694,60.167,138.063,61.9254,139.406,62.4843"/>
                </svg>
            `),

            // Snowman face
            () => transformSvg(`
                <svg viewBox="0 0 300 300">
                <g>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M153.928,26.5531 C141.111,24.1499,127.795,38.7927,126.332,50.7702 C125.548,57.1946,126.286,65.5595,129.232,71.4085 C135.722,84.2957,151.737,92.5954,166.007,89.174 C170.79,88.0273,174.543,85.5923,178.119,82.3225 C182.59,78.2337,186.15,74.3244,188.228,68.4802 C195.082,49.2027,179.658,30.126,161.268,26.7743 C156.475,25.9008,153.287,24.9258,148.469,26.3711"/>
                    <g>
                    <path style="fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M159.43,49.5211 C153.519,49.9433,150.155,60.7265,157.279,61.6466 C161.613,62.2063,163.893,56.4564,162.654,52.9703 C161.847,50.7022,161.525,50.2196,159.43,49.5211 z"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M159.43,49.5211 C153.519,49.9433,150.155,60.7265,157.279,61.6466 C161.613,62.2063,163.893,56.4564,162.654,52.9703 C161.847,50.7022,161.525,50.2196,159.43,49.5211 z"/>
                    </g>
                    <g>
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M177.332,49.5211 C170.693,47.7507,168.573,61.9465,175.584,62.1936 C180.154,62.3546,181.66,56.2082,180.217,52.815 C179.226,50.4832,179.555,50.3148,177.332,49.5211 z"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M177.332,49.5211 C170.693,47.7507,168.573,61.9465,175.584,62.1936 C180.154,62.3546,181.66,56.2082,180.217,52.815 C179.226,50.4832,179.555,50.3148,177.332,49.5211 z"/>
                    </g>
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M181.673,65.8566 C180.448,67.082,180.177,68.5375,179.206,69.915 C176.41,73.8834,173.772,77.7242,170.098,80.9514 C168.304,82.5271,164.713,84.5195,162.29,83.294 C160.723,82.501,160.264,79.2606,159.318,77.7969 C157.562,75.082,155.31,73.8525,152.265,72.4972 C159.28,75.7707,167.699,75.1629,174.401,71.1446 C176.862,69.6687,179.751,67.9714,181.673,65.8566 z"/>
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M120.607,16.1009 C127.761,26.6158,132.581,38.5543,131.764,51.435 C134.749,49.8314,136.909,47.1681,139.607,45.2026 C144.04,41.9732,148.661,39.3568,153.184,36.3405 C156.091,34.4013,159.486,32.5516,162.639,31.0391 C163.362,30.6919,165.982,30.0789,165.629,28.8943 C165.238,27.5821,163.089,26.2404,162.125,25.3173 C159.407,22.7155,155.822,19.7133,153.689,16.642 C151.808,13.9331,150.578,10.4721,149.235,7.47487 C148.972,6.88945,148.537,4.67409,147.829,4.57568 C145.732,4.28434,141.656,7.07431,139.739,7.93737 C133.314,10.8294,127.083,13.3195,120.607,16.1009 z"/>
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M169.356,22.0198 C165.965,18.6448,160.693,22.5211,156.826,23.9131 C144.926,28.1974,134.27,36.39,124.258,43.9123 C121.315,46.1236,117.853,48.4894,115.354,51.1889 C114.575,52.0309,113.049,53.7979,113.797,55.0114 C114.66,56.4124,117.103,56.2695,118.501,56.0688 C122.619,55.4776,126.465,53.6415,130.177,51.8502 C138.344,47.9097,145.919,42.8986,153.862,38.5719 C159.997,35.2296,167.812,31.6162,172.417,26.1999 C174.9,23.2788,172.205,20.8972,169.133,20.7299 C167.343,20.6324,165.589,21.7872,164.016,22.5103"/>
                </g>
                </svg>
            `),

            // simple guy
            () => transformSvg(`
            <svg viewBox="0 0 300 300">
                <g >
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M151.544,26.1785 C143.101,27.3846,135.791,30.9772,130.271,37.7986 C119.428,51.1963,118.52,74.425,133.869,85.0858 C137.314,87.4784,141.934,89.1514,146.025,90.0564 C150.317,91.0058,155.063,91.4427,159.446,90.7552 C163.948,90.0492,168.589,87.7931,172.513,85.5488 C178.896,81.8976,185.901,75.6515,188.38,68.5368 C190.87,61.3868,189.099,52.7325,185.507,46.3253 C181.712,39.558,176.371,32.7927,169.08,29.5251 C165.985,28.1383,162.285,27.6219,159,26.842 C155.64,26.0444,155.053,25.9279,151.544,26.1785 z"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M143.081,48.6438 C142.709,51.2493,142.466,53.8595,142.466,56.4913"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M163.546,49.8748 C163.546,52.4455,163.54,55.0019,163.7,57.5684"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M145.697,71.5707 C147.122,79.1718,153.069,79.5809,158.622,75.8791"/>
                    </g>
                </g>
                </svg> 
            `),
            // Tintin
            () => transformSvg(`
                <svg viewBox="0 0 300 300" >
                <g >
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M155.361,16.5946 C150.413,17.5842,146.213,21.5576,142.451,24.7185 C136.929,29.3585,130.819,35.6305,128.157,42.4704 C122.36,57.3676,128.402,79.4754,144.493,85.336 C156.958,89.8764,173.803,87.7019,180.55,74.9831 C187.562,61.7654,188.488,39.5328,171.549,33.8424 C169.19,33.05,167.291,32.7573,164.801,32.7573"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M155.361,16.5946 C150.413,17.5842,146.213,21.5576,142.451,24.7185 C136.929,29.3585,130.819,35.6305,128.157,42.4704 C122.36,57.3676,128.402,79.4754,144.493,85.336 C156.958,89.8764,173.803,87.7019,180.55,74.9831 C187.562,61.7654,188.488,39.5328,171.549,33.8424 C169.19,33.05,167.291,32.7573,164.801,32.7573"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M150.069,29.4676 C156.239,24.2463,163.748,22.2418,171.237,19.5983"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M150.069,29.4676 C156.239,24.2463,163.748,22.2418,171.237,19.5983"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M160.367,31.47 C169.779,26.4874,179.64,24.9549,189.975,22.8881"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M160.367,31.47 C169.779,26.4874,179.64,24.9549,189.975,22.8881"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M160.367,56.0716 C158.892,56.7038,155.751,60.9508,158.963,61.604 C160.979,62.0137,163.528,58.5291,162.302,56.7218 C161.873,56.0899,161.042,56.1616,160.367,56.0716 z"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M160.367,56.0716 C158.892,56.7038,155.751,60.9508,158.963,61.604 C160.979,62.0137,163.528,58.5291,162.302,56.7218 C161.873,56.0899,161.042,56.1616,160.367,56.0716 z"/>
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M160.367,56.0716 C158.892,56.7038,155.751,60.9508,158.963,61.604 C160.979,62.0137,163.528,58.5291,162.302,56.7218 C161.873,56.0899,161.042,56.1616,160.367,56.0716 z"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M173.383,56.6437 C170.188,58.364,170.703,63.2477,174.899,61.9749 C176.799,61.3985,177.691,58.2732,176.454,56.8014 C175.767,55.9837,174.362,56.8884,173.383,56.6437 z"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M173.383,56.6437 C170.188,58.364,170.703,63.2477,174.899,61.9749 C176.799,61.3985,177.691,58.2732,176.454,56.8014 C175.767,55.9837,174.362,56.8884,173.383,56.6437 z"/>
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M173.383,56.6437 C170.188,58.364,170.703,63.2477,174.899,61.9749 C176.799,61.3985,177.691,58.2732,176.454,56.8014 C175.767,55.9837,174.362,56.8884,173.383,56.6437 z"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M150.784,69.8027 C157.396,73.6923,163.276,75.3274,170.951,73.5216"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M150.784,69.8027 C157.396,73.6923,163.276,75.3274,170.951,73.5216"/>
                    </g>
                </g>
                <g />
                </svg>
                `),
            // mog cool guy
            () => transformSvg(`
                <svg viewBox="0 0 300 300" >
                <g>
                    <g>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M147.824,27.8767 C143.589,27.2716,141.16,29.9168,137.89,32.1864 C125.985,40.448,124.302,58.6524,130.876,70.73 C134.038,76.5388,139.843,79.0981,145.889,80.7813 C155.952,83.5829,167.038,84.4292,176.186,78.4587 C179.9,76.0346,182.255,71.3365,183.754,67.3083 C188.413,54.7845,185.362,38.0282,173.813,30.1605 C168.555,26.5786,158.966,23.8771,152.675,25.3278 C148.23,26.3529,144.245,28.9969,140.038,30.6796"/>
                    </g>
                    <g>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M157.79,70.6994 C162.514,73.0611,168.468,69.2435,172.428,66.3393"/>
                    </g>
                    <linearGradient id="#am4" x1="159.971" y1="41.8914" x2="161.528" y2="59.1762" gradientUnits="userSpaceOnUse">
                    <stop style="stop-color:#46edaa;stop-opacity:1;"/>
                    <stop offset="1" style="stop-color:#ff931d;stop-opacity:1;"/>
                    </linearGradient>
                    <g>
                    <path style="fill:url(#am4);fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M134.588,59.3319 C137.155,64.4657,143.765,64.4674,148.534,62.5684 C149.834,62.0509,151.785,61.8952,152.584,60.5849 C153.548,59.0029,153.649,52.0014,155.978,52.0465 C160.502,52.134,159.574,60.2677,161.546,62.8197 C162.543,64.1088,165.72,63.591,167.178,63.5274 C170.414,63.386,175.818,62.3862,177.947,59.5933 C178.706,58.5985,178.499,56.3271,178.501,55.1201 C178.508,51.811,179.967,47.9643,179.406,44.7198 C179.253,43.8368,177.91,43.8463,177.22,43.6695 C174.752,43.037,172.231,42.678,169.765,42.0343 C163.315,40.3504,155.69,41.8952,149.249,42.9218 C144.363,43.7004,139.358,44.266,134.588,44.2272 C132.727,48.8812,132.484,54.7726,134.588,59.3319 z"/>
                    </g>
                    <g>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M179.909,44.7122 C182.077,46.8808,186.029,50.2744,185.276,53.5764 C183.631,52.4914,182.428,50.8096,181.181,49.3295 C180.751,48.8193,179.993,48.3252,179.74,47.7003 C179.399,46.8558,179.909,45.619,179.909,44.7122 z"/>
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M179.909,44.7122 C182.077,46.8808,186.029,50.2744,185.276,53.5764 C183.631,52.4914,182.428,50.8096,181.181,49.3295 C180.751,48.8193,179.993,48.3252,179.74,47.7003 C179.399,46.8558,179.909,45.619,179.909,44.7122 z"/>
                    </g>
                    <g>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M134.45,44.7935 C132.662,45.3042,128.624,47.2293,128.045,49.2239 C127.582,50.8219,128.121,52.8904,127.456,54.3896 C128.773,53.0444,130.012,51.6332,131.358,50.3021 C131.904,49.7615,132.912,49.1412,133.261,48.4684 C133.688,47.6441,134.255,45.7025,134.45,44.7935 z"/>
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M134.45,44.7935 C132.662,45.3042,128.624,47.2293,128.045,49.2239 C127.582,50.8219,128.121,52.8904,127.456,54.3896 C128.773,53.0444,130.012,51.6332,131.358,50.3021 C131.904,49.7615,132.912,49.1412,133.261,48.4684 C133.688,47.6441,134.255,45.7025,134.45,44.7935 z"/>
                    </g>
                    <g>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M186.065,43.9249 C184.234,41.1787,182.252,37.2545,179.693,35.1856 C178.03,33.8416,175.923,33.1593,174.194,31.8581 C171.809,30.0636,169.869,28.2088,166.871,27.3675 C162.123,26.0347,156.927,26.7393,152.132,27.3958 C148.031,27.9574,142.177,28.1763,138.585,31.6877 C140.53,37.1986,143.581,36.8638,148.701,37.8879 C148.592,35.9387,148.212,34.9252,148.212,33.4825 C150.553,37.8164,154.922,38.2803,158.817,39.8458 C157.752,36.8276,156.436,33.9167,155.391,30.8719 C157.622,34.2874,161.273,37.0513,165.132,38.1538 C165.771,38.3365,167.177,39.7348,167.805,39.4242 C168.476,39.0925,166.398,34.1662,166.159,33.4825 C167.612,36.0944,172.795,42.334,176.447,41.5095 C177.544,41.2618,175.705,37.2439,175.46,36.5826 C177.317,40.7781,181.538,43.3212,186.065,43.9249 z"/>
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M186.065,43.9249 C184.234,41.1787,182.252,37.2545,179.693,35.1856 C178.03,33.8416,175.923,33.1593,174.194,31.8581 C171.809,30.0636,169.869,28.2088,166.871,27.3675 C162.123,26.0347,156.927,26.7393,152.132,27.3958 C148.031,27.9574,142.177,28.1763,138.585,31.6877 C140.53,37.1986,143.581,36.8638,148.701,37.8879 C148.592,35.9387,148.212,34.9252,148.212,33.4825 C150.553,37.8164,154.922,38.2803,158.817,39.8458 C157.752,36.8276,156.436,33.9167,155.391,30.8719 C157.622,34.2874,161.273,37.0513,165.132,38.1538 C165.771,38.3365,167.177,39.7348,167.805,39.4242 C168.476,39.0925,166.398,34.1662,166.159,33.4825 C167.612,36.0944,172.795,42.334,176.447,41.5095 C177.544,41.2618,175.705,37.2439,175.46,36.5826 C177.317,40.7781,181.538,43.3212,186.065,43.9249 z"/>
                    </g>
                </g>
                </svg>
            `),
        ],
        sad: [                       // Looking down guy
            () => transformSvg(`

<svg viewBox="0 0 300 300">
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M151.334,26.6708 C141.405,30.6523,128.403,41.9649,124.426,52.3027 C120.809,61.702,123.727,75.3924,131.718,81.6293 C138.477,86.9048,149.998,90.1,158.523,89.3532 C161.185,89.12,163.617,87.5893,166.299,87.3245 C171.661,86.7952,177.044,88.6385,182.075,86.0055 C190.218,81.7441,192.68,74.0549,193.555,65.5916 C193.949,61.7738,194.754,58.5724,192.984,54.8543 C185.345,38.8047,170.368,24.0585,151.334,26.6708 z"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M142.986,52.5522 C152.469,51.3237,160.841,49.0964,170.556,49.8975 C172.75,50.0785,175.68,49.6133,177.733,50.4237 C180.387,51.4713,182.822,54.5166,185.338,56.0448"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M141.088,50.9502 C141.088,50.9502,143.529,53.7037,143.529,53.7037"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M186.937,54.8472 C186.937,54.8472,185.086,57.5947,185.086,57.5947"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M141.165,28.9156 C144.415,29.3663,148.236,29.3191,151.158,31.0432 C154.459,32.9904,157.574,37.8854,161.573,36.0509"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M171.329,37.3194 C174.734,34.1425,179.074,32.6288,183.431,31.2411"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M157.567,55.0933 C161.073,55.1975,164.539,54.5083,168.032,54.7963"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M157.004,36.6021 C155.804,39.5622,154.241,42.6281,150.927,43.6757 C147.828,44.6553,143.405,42.2567,141.231,39.3616 C145.842,37.0879,151.937,36.7786,157.004,36.6021 z"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M173.337,38.297 C176.225,39.089,179.877,39.0269,182.565,40.3341 C179.918,44.6735,174.686,43.7359,170.894,41.2807 C169.712,40.5154,167.686,39.3708,167.576,37.8219 C169.895,38.0013,171.168,37.3147,173.337,38.297 z"/>
    <path  style="fill:#000000;fill-opacity:1;fill-rule:evenodd;opacity:1;stroke:none;" d="M152.423,38.7553 C153.005,38.7553,153.477,39.311,153.477,39.9964 C153.477,40.6819,153.005,41.2376,152.423,41.2376 C151.841,41.2376,151.369,40.6819,151.369,39.9964 C151.369,39.311,151.841,38.7553,152.423,38.7553 z"/>
    <path  style="fill:#000000;fill-opacity:1;fill-rule:evenodd;opacity:1;stroke:none;" d="M178.627,40.2503 C179.316,40.2503,179.875,40.8203,179.875,41.5235 C179.875,42.2267,179.316,42.7967,178.627,42.7967 C177.939,42.7967,177.38,42.2267,177.38,41.5235 C177.38,40.8203,177.939,40.2503,178.627,40.2503 z"/>
</svg>

                `),
            // blaze 
            // angry guy 
            () => transformSvg(`

<svg viewBox="0 0 300 300" >
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M143.617,40.4636 C138.203,40.0171,134.967,44.3239,131.896,48.1989 C125.341,56.4711,119.452,69.9429,129.395,78.2575 C132.121,80.5373,135.266,82.9789,138.627,84.2236 C149.775,88.3526,163.309,84.4968,173.851,80.2696 C180.117,77.7572,187.788,73.8735,191.164,67.6734 C197.74,55.598,189.545,41.487,178.435,36.0433 C165.352,29.6325,149.3,31.7398,135.757,35.0467"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M146.864,55.1913 C152.108,55.9554,158.618,57.9743,162.535,53.5609"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M167.741,51.9904 C168.164,52.7539,168.639,54.1693,169.501,54.5201 C170.74,55.0242,172.437,54.3681,173.647,54.0406 C177.174,53.0852,180.467,51.5088,184.011,50.5632"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M152.048,57.6186 C148.475,59.1613,145.232,63.253,149.568,66.3308 C153.725,69.2822,160.181,66.998,161.471,61.9225 C162.445,58.0918,157.388,56.1868,154.398,56.6769 C152.639,56.9651,153.53,56.7088,152.048,57.6186 z"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M179.15,53.5466 C175.822,53.51,172.57,54.746,170.602,57.5585 C169.797,58.7092,168.826,60.248,169.861,61.5723 C172.774,65.2987,178.908,61.1782,181.597,59.3171 C182.542,58.6624,184.056,57.8878,184.474,56.7558 C185.959,52.7403,181.157,53.0564,179.15,53.5466 z"/>
    <path  style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M163.039,77.2923 C165.572,75.8307,168.264,74.7773,171.124,74.1272 C171.97,73.9349,174.281,74.2577,174.862,73.7557 C176.633,72.227,174.187,68.8259,173.124,67.7047 C172.311,66.8471,171.32,65.994,170.182,65.629 C168.667,65.1431,166.423,64.3209,164.868,64.993 C160.797,66.7529,161.639,74.0859,163.039,77.2923 z"/>
    <path  style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M163.945,50.1811 C163.945,50.1811,163.945,50.1811,163.945,50.1811 z"/>
    <path  style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M164.515,50.2281 C164.515,50.2281,164.515,50.2281,164.515,50.2281 z"/>
    <path  style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M163.509,48.5048 C163.899,49.8805,164.319,51.1351,164.992,52.3998"/>
    <path  style="fill:#000000;fill-opacity:1;fill-rule:evenodd;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M157.14,59.8741 C158.056,59.8741,158.799,60.3769,158.799,60.9972 C158.799,61.6175,158.056,62.1204,157.14,62.1204 C156.224,62.1204,155.482,61.6175,155.482,60.9972 C155.482,60.3769,156.224,59.8741,157.14,59.8741 z"/>
    <path  style="fill:#000000;fill-opacity:1;fill-rule:evenodd;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M181.1,56.3204 C182.012,56.3204,182.751,56.7351,182.751,57.2466 C182.751,57.7581,182.012,58.1728,181.1,58.1728 C180.188,58.1728,179.448,57.7581,179.448,57.2466 C179.448,56.7351,180.188,56.3204,181.1,56.3204 z"/>
</svg>

                        `),
            // mad guy
            () => transformSvg(`

<svg viewBox="0 0 300 300" >
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M127.157,47.6059 C132.128,34.6207,143.805,30.6372,156.444,28.2589 C160.358,27.5224,166.924,26.1006,170.736,27.6889 C181.348,32.1102,183.669,45.7886,184.835,55.4995 C185.375,59.9918,186.236,65.0503,184.517,69.4263 C180.661,79.2353,169.834,84.6281,160.465,86.9971 C151.906,89.1612,144.652,90.2905,136.894,84.6602 C130.635,80.1174,127.9,70.1771,126.332,63.012 C125.842,60.7769,124.52,58.8035,124.663,56.4214 C124.863,53.0953,126.164,50.7697,127.157,47.6059 z"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M182.039,48.9626 C183.896,54.7544,181.021,62.7941,174.143,63.7546 C172.231,64.0216,170.266,63.3356,169.764,61.291 C169.542,60.3842,169.678,59.0425,169.214,58.2435 C168.309,56.683,166.303,55.2778,164.704,53.8351 C165.816,54.4423,167.407,56.2403,168.588,56.4422 C169.6,56.6153,171.288,55.2226,172.11,54.7157 C175.179,52.8222,178.767,50.5293,182.039,48.9626 z"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M140.839,63.3721 C141.43,65.1639,141.91,67.6693,143.411,68.9657 C144.411,69.8288,145.896,69.7662,147.133,69.8075 C150.083,69.906,156.216,71.3949,158.37,68.6836 C160.132,66.4663,158.628,63.4023,158.666,60.8525 C158.688,59.3931,159.849,57.6585,160.667,55.7757 C160.2,56.9948,159.596,59.0492,158.553,59.8928 C157.664,60.612,156.122,60.7911,155.052,61.145 C150.758,62.5659,145.323,62.815,140.839,63.3721 z"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M172.964,57.2195 C172.964,57.2195,173.145,57.6147,173.145,57.6147"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M156.129,63.6083 C155.853,63.7934,154.437,64.5127,154.803,64.9535 C155.894,66.2698,156.162,64.3678,156.129,63.6083 z"/>
    <path  style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M173.462,57.0182 C172.911,57.5574,171.765,58.9143,173.4,59.0006 C174.402,59.0534,173.649,57.4086,173.462,57.0182 z"/>
    <path  style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M167.879,77.1684 C169.942,76.0201,176.23,74.1049,172.217,71.4298 C170.501,70.286,167.493,70.8079,166.947,73.0212 C166.544,74.655,167.552,75.5943,167.879,77.1684 z"/>
</svg>

                `),
            // blaze
            () => transformSvg(`
                <svg viewBox="0 0 300 300" >
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M154.789,25.0784 C146.119,28.2319,127.852,40.7378,126.578,50.8002 C126.228,53.5694,125.874,57.1704,126.828,59.8537 C127.437,61.5684,129.09,62.475,129.329,64.3721 C130.118,70.6518,130.916,76.8538,135.938,81.3647 C146.672,91.0072,167.82,88.5599,179.984,82.957 C190.731,78.0067,192.688,65.0213,188.945,54.7736 C187.411,50.5743,186.58,46.2869,184.269,42.3909 C178.636,32.8951,165.761,22.0662,154.789,25.0784 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M147.125,49.0391 C151.999,49.0391,155.951,52.8847,155.951,57.6285 C155.951,62.3722,151.999,66.2178,147.125,66.2178 C142.251,66.2178,138.3,62.3722,138.3,57.6285 C138.3,52.8847,142.251,49.0391,147.125,49.0391 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M154.366,77.7794 C160.139,77.4621,165.792,76.2282,171.554,76.6765"/>
                    <path  style="fill:#000000;fill-opacity:1;fill-rule:evenodd;opacity:1;stroke:none;" d="M147.125,55.4853 C148.379,55.4853,149.396,56.4448,149.396,57.6285 C149.396,58.8121,148.379,59.7716,147.125,59.7716 C145.872,59.7716,144.855,58.8121,144.855,57.6285 C144.855,56.4448,145.872,55.4853,147.125,55.4853 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M171.785,46.8959 C176.659,46.8959,180.611,50.7415,180.611,55.4853 C180.611,60.2291,176.659,64.0747,171.785,64.0747 C166.911,64.0747,162.96,60.2291,162.96,55.4853 C162.96,50.7415,166.911,46.8959,171.785,46.8959 z"/>
                    <path  style="fill:#000000;fill-opacity:1;fill-rule:evenodd;opacity:1;stroke:none;" d="M171.785,53.3421 C173.039,53.3421,174.056,54.3017,174.056,55.4853 C174.056,56.6689,173.039,57.6285,171.785,57.6285 C170.532,57.6285,169.515,56.6689,169.515,55.4853 C169.515,54.3017,170.532,53.3421,171.785,53.3421 z"/>
                </svg>
            `),
            // Sad guy
            () => transformSvg(`

                <svg viewBox="0 0 300 300" >
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M154.985,29.5836 C129.973,23.9204,116.15,61.5304,130.462,79.2967 C137.205,87.6674,152.584,88.4815,162.312,86.2336 C183.574,81.3208,190.846,53.3683,176.801,37.451 C168.158,27.6555,155.503,26.9331,143.856,29.8668"/>
                    <path  style="fill:#000000;fill-opacity:1;fill-rule:evenodd;opacity:1;stroke:none;" d="M132.806,64.7872 C134,64.7872,134.968,66.2542,134.968,68.064 C134.968,69.8737,134,71.3408,132.806,71.3408 C131.612,71.3408,130.644,69.8737,130.644,68.064 C130.644,66.2542,131.612,64.7872,132.806,64.7872 z"/>
                    <path  style="fill:#000000;fill-opacity:1;fill-rule:evenodd;opacity:1;stroke:none;" d="M148.337,63.1482 C149.926,63.1482,151.214,64.9822,151.214,67.2445 C151.214,69.5068,149.926,71.3408,148.337,71.3408 C146.748,71.3408,145.459,69.5068,145.459,67.2445 C145.459,64.9822,146.748,63.1482,148.337,63.1482 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M144.922,58.4876 C147.723,61.6545,150.684,63.0067,154.805,63.5225"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M137.092,79.8156 C142.844,78.6051,145.868,78.7495,150.811,82.1437"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M122.609,66.2178 C125.298,65.0352,127.118,63.41,129.1,61.2777"/>
                </svg>

            `),
            // Sad trool
            () => transformSvg(`
                <svg viewBox="0 0 300 300" >
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M133.085,72.8795 C129.284,71.9234,133.257,71.2878,131.226,68.4531 C126.019,61.1837,129.076,62.8765,130.657,53.9677 C131.672,48.2484,132.626,40.944,136.023,36.071 C137.586,33.8297,140.289,32.0503,142.571,30.6519 C150.647,25.7022,160.678,23.4501,170.066,25.6328 C173.534,26.4392,178.169,27.7126,181.155,29.6772 C185.912,32.8067,189.835,38.9372,192.353,43.914 C193.337,45.8596,194.973,48.1207,195.426,50.2663 C196.628,55.9643,194.96,62.0798,193.861,67.6476 C193.272,70.6351,193.05,73.7004,192.732,76.7284 C192.593,78.0584,192.472,79.9989,191.458,80.9911 C189.622,82.7855,186.384,83.5869,183.973,84.1792 C176.955,85.903,172.237,88.784,165.141,88.0397"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M137.956,81.6113 C139.448,84.5914,143.243,84.6838,146.213,85.0885 C148.011,85.3334,149.795,86.0912,151.607,86.4076 C154.7,86.9474,157.843,86.8098,160.945,87.182 C162.22,87.3348,163.427,88.0224,164.705,88.2412"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M139.286,72.8795 C150.934,66.2761,165.966,65.1629,178.685,68.3622"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M180.514,61.9224 C183.674,62.6585,188.674,66.9595,185.938,70.7671 C185.13,71.8926,183.338,72.0656,182.124,72.4819 C178.544,73.71,174.853,74.5844,171.273,75.8022"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M139.885,67.1756 C136.605,68.6191,134.274,71.7528,132.082,74.5646 C131.364,75.486,129.868,76.9181,130.424,78.232 C132.309,82.6917,141.264,79.9108,144.52,79.3393"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M137.667,56.7072 C141.965,54.4505,147.382,54.2593,151.38,51.7083 C152.576,50.9456,155.397,49.433,154.207,47.6551 C153.205,46.1572,150.423,45.791,148.801,45.621 C143.724,45.0889,138.49,46.326,135.642,50.7224 C134.885,51.8921,131.859,56.6694,133.636,57.8587 C134.746,58.6016,136.562,57.0494,137.667,56.7072 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M164.066,49.673 C167.136,50.2183,168.739,52.0469,171.425,53.3719 C172.958,54.1282,175.155,54.4642,176.833,54.9068 C178.333,55.3024,181.198,55.9358,181.69,53.869 C182.196,51.7417,180.401,49.8893,178.957,48.6443 C175.563,45.7174,169.968,43.2699,165.426,43.6749 C160.55,44.1098,161.833,47.4184,164.066,49.673 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M133.137,43.5454 C138.079,42.6382,142.929,41.733,147.737,40.262 C149.475,39.7301,152.171,39.2856,153.274,37.6644 C153.935,36.6939,153.714,35.0115,153.756,33.8867"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M158.349,34.0801 C158.566,35.4555,158.586,37.2002,159.807,38.1048 C161.552,39.3985,164.688,38.7786,166.76,38.999 C171.44,39.4972,175.725,40.9441,180.529,41.1641"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M147.792,60.5085 C149.878,58.9774,151.007,57.1466,152.271,54.9232"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M162.875,54.1614 C164.656,56.3601,167.045,56.26,169.638,57.0332"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M156.924,75.162 C156.924,75.162,156.924,75.162,156.924,75.162 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M154.695,75.7933 C156.575,75.3435,158.155,75.111,160.091,75.2059"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M146.887,48.1926 C147.387,48.1926,147.792,48.4795,147.792,48.8335 C147.792,49.1874,147.387,49.4743,146.887,49.4743 C146.388,49.4743,145.982,49.1874,145.982,48.8335 C145.982,48.4795,146.388,48.1926,146.887,48.1926 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M168.529,47.0941 C169.032,47.0941,169.439,47.4834,169.439,47.9638 C169.439,48.4441,169.032,48.8335,168.529,48.8335 C168.027,48.8335,167.62,48.4441,167.62,47.9638 C167.62,47.4834,168.027,47.0941,168.529,47.0941 z"/>
                </svg>
                `),
            // angry simple guy
            () => transformSvg(`
            <svg viewBox="0 0 300 300">
                <g >
                    <path  style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M155.921,27.045 C148.036,25.3554,141.06,32.9793,135.957,38.0845 C129.787,44.2568,125.236,52.6109,126.364,61.6136 C126.835,65.376,129.058,68.6842,131.371,71.5922 C137.686,79.5333,149.367,87.0554,159.973,85.9068 C164.287,85.4395,168.397,83.6688,172.176,81.628 C179.133,77.8712,185.483,71.5542,187.861,63.8305 C189.002,60.1243,188.615,56.3816,187.973,52.6495 C185.128,36.1202,167.617,24.1731,151.105,27.045"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M141.897,46.1684 C145.806,44.344,148.575,45.9158,150.821,49.2848"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M162.579,50.843 C164.929,47.7097,167.527,44.3805,170.795,42.2021"/>
                    <path  style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M167.82,49.4265 C166.888,49.1603,165.959,48.7222,165.068,49.3248 C163.74,50.2244,163.542,52.6987,165.126,53.4831 C167.141,54.4812,169.369,52.354,169.063,50.3183 C168.733,48.1222,168.695,48.7704,167.82,49.4265 z"/>
                    <path  style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M148.697,48.7182 C147.942,48.6643,146.775,48.3493,146.154,48.904 C144.481,50.3967,146.102,52.9584,147.833,53.4452 C151.097,54.363,150.653,50.0228,148.697,48.7182 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M148.555,69.6831 C149.621,68.3803,152.099,65.2685,154.133,66.6837 C155.416,67.5766,155.977,70.0869,157.43,70.5703 C159.189,71.1557,160.303,69.508,161.862,69.2987 C164.106,68.9978,166.015,70.469,168.528,69.9664"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M189.245,5.07622 C187.007,7.50041,184.709,10.2194,183.36,13.2553 C182.997,14.0717,182.004,15.575,182.347,16.4937 C182.977,18.1802,188.731,17.0733,188.76,19.2133 C188.772,20.091,187.317,21.5754,186.821,22.2694 C185.088,24.6968,183.314,26.9848,181.914,29.6281"/>
                </g>
                <g />
            </svg>
            `),
            // Hexagon head
            () => transformSvg(`
                <svg viewBox="0 0 300 300" >
                <g >
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M156.41,30.5267 C148.144,37.2898,132.794,47.1192,129.946,57.934 C127.135,68.6128,145.472,80.9533,153.329,85.0951 C156.546,86.7907,159.354,88.6267,163.191,88.0312 C167.864,87.3062,171.689,83.2869,174.993,80.2668 C179.649,76.0103,187.181,72.0496,187.811,64.9928 C188.762,54.3323,172.275,42.6672,165.081,36.8157 C162.391,34.6277,156.561,31.4482,156.189,27.7029 C155.853,24.3259,159.208,21.2855,161.131,18.8825"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M145.61,23.7286 C150.273,23.1457,152.848,27.0275,154.885,30.8116 C159.135,28.555,161.387,26.3145,164.667,24.9091"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M155.56,29.1251 C155.287,26.6656,154.599,24.6788,153.705,22.3794"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M157.415,53.4097 C157.689,57.5284,154.662,62.7377,149.604,61.3949 C145.782,60.3806,143.636,57.6489,142.237,52.9038 C147.232,52.2794,152.439,54.1205,157.415,53.4097 z"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M148.454,53.5923 C148.306,54.4322,147.952,55.5535,148.25,56.3919 C148.686,57.6209,150.547,57.4828,151.38,56.8583 C152.07,56.3408,152.632,54.6001,151.744,54.0316 C150.548,53.2664,149.522,54.2302,149.372,55.4276 C149.372,55.4276,150.657,55.1523,150.657,55.1523"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M174.279,54.5902 C175.484,57.9625,174.809,61.8404,170.366,61.8381 C166.365,61.8361,165.029,57.2672,164.161,53.241 C167.407,53.241,171.053,54.9697,174.279,54.5902 z"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M163.655,76.851 C166.256,75.7359,167.399,75.3015,166.184,72.4663"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:2;" d="M169.101,54.877 C169.39,55.6864,170.176,58.0079,171.484,57.2448 C171.864,57.0231,172.772,55.552,172.28,55.1758 C171.867,54.8591,169.634,54.9913,169.101,54.877 z"/>
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M169.101,54.877 C169.39,55.6864,170.176,58.0079,171.484,57.2448 C171.864,57.0231,172.772,55.552,172.28,55.1758 C171.867,54.8591,169.634,54.9913,169.101,54.877 z"/>
                    </g>
                </g>
                <g />
                </svg>
                `),
            // sad girl
            () => transformSvg(`
            <svg viewBox="0 0 300 300">
                <g>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M158.79,36.8942 C151.599,36.8942,143.498,36.3273,137.619,41.3751 C126.671,50.7774,126.197,74.3919,141.482,79.8587 C154.903,84.6584,178.058,81.3964,181.842,64.9735 C186.27,45.7509,177.712,28.7845,158.79,36.8942 z"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M190.469,94.6278 C191.868,91.4301,197.977,79.3852,201.558,87.3598 C204.94,94.8905,194.688,110.488,186.618,102.77 C175.56,92.1938,193.333,73.5867,197.669,64.8345 C202.546,54.9918,195.719,38.2682,187.581,31.7705 C183.788,28.7416,177.326,27.3009,172.616,26.7073 C165.822,25.8513,161.003,28.5153,153.164,28.6042 C131.316,28.8523,110.587,51.1362,122.359,73.0318 C125.649,79.1527,141.875,91.5447,136.867,99.5791 C133.072,105.668,118.996,101.36,118.297,94.6329 C117.93,91.1047,123.364,90.1133,125.865,91.3669 C127.948,92.4106,127.574,95.9646,127.702,97.8846"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M133.032,54.6584 C138.681,56.1649,142.745,55.4742,147.929,52.6738 C149.478,51.8374,154.846,47.313,150.5,46.9606 C155.306,51.8746,164.161,44.6036,162.343,37.7824"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M141.914,61.7641 C147.369,66.7652,153.066,65.2171,152.572,57.323"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M164.711,55.5466 C171.373,57.4501,174.844,53.4294,171.521,47.2566"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M159.238,73.7156 C159.45,70.7554,163.19,64.5824,166.96,66.7511 C168.153,67.4372,168.6,69.0307,169.077,70.2243"/>
                </g>
            </svg>
            `),
            // Simple flat head guy
            () => transformSvg(`
                <svg viewBox="0 0 300 300">
                <g >
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M161.08,27.7141 C158.549,27.5333,155.701,27.0984,153.188,27.4901 C136.626,30.0726,114.667,44.3864,120.685,63.5534 C123.533,72.6226,132.631,77.7229,141.426,79.8009 C154.623,82.9187,169.061,84.4279,181.556,77.7982 C189.938,73.3502,199.551,65.2168,198.288,54.6354 C197.822,50.7343,195.977,47.063,193.791,43.871 C192.125,41.4383,189.623,39.3101,187.257,37.5832 C178.471,31.1701,163.397,29.0222,152.819,29.4001"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M161.08,27.7141 C158.549,27.5333,155.701,27.0984,153.188,27.4901 C136.626,30.0726,114.667,44.3864,120.685,63.5534 C123.533,72.6226,132.631,77.7229,141.426,79.8009 C154.623,82.9187,169.061,84.4279,181.556,77.7982 C189.938,73.3502,199.551,65.2168,198.288,54.6354 C197.822,50.7343,195.977,47.063,193.791,43.871 C192.125,41.4383,189.623,39.3101,187.257,37.5832 C178.471,31.1701,163.397,29.0222,152.819,29.4001"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M150.458,68.3451 C157.894,64.3791,167.174,61.4766,175.496,60.0809 C179.673,59.3803,183.113,58.5337,186.031,61.9385"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M150.458,68.3451 C157.894,64.3791,167.174,61.4766,175.496,60.0809 C179.673,59.3803,183.113,58.5337,186.031,61.9385"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M176.299,46.157 C179.127,48.5501,180.617,47.6816,183.318,45.5597"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M176.299,46.157 C179.127,48.5501,180.617,47.6816,183.318,45.5597"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M158.53,48.6955 C161.371,50.4443,163.31,49.1083,166.145,47.7996"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M158.53,48.6955 C161.371,50.4443,163.31,49.1083,166.145,47.7996"/>
                    </g>
                </g>
                <g />
                </svg>
            `),
            () => transformSvg(`
                <svg viewBox="0 0 300 300">
                <g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M149.414,27.8669 C136.921,27.0341,128.879,39.2424,126.106,49.9277 C123.935,58.2933,124.237,69.5905,129.048,77.0375 C135.42,86.9029,150.252,91.4398,161.266,88.1727 C166.713,86.5569,173.159,83.992,176.861,79.4555 C185.155,69.2942,186.064,49.5793,178.264,38.9699 C173.524,32.5221,161.885,27.5352,153.987,27.4728 C148.985,27.4332,144.281,30.0384,139.928,32.215"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M149.414,27.8669 C136.921,27.0341,128.879,39.2424,126.106,49.9277 C123.935,58.2933,124.237,69.5905,129.048,77.0375 C135.42,86.9029,150.252,91.4398,161.266,88.1727 C166.713,86.5569,173.159,83.992,176.861,79.4555 C185.155,69.2942,186.064,49.5793,178.264,38.9699 C173.524,32.5221,161.885,27.5352,153.987,27.4728 C148.985,27.4332,144.281,30.0384,139.928,32.215"/>
                    </g>
                    <g >
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M149.922,48.9747 C144.668,48.9747,143.809,54.3458,147.872,54.4478 C151.986,54.5509,150.533,50.4295,149.922,48.9747 z"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M149.922,48.9747 C144.668,48.9747,143.809,54.3458,147.872,54.4478 C151.986,54.5509,150.533,50.4295,149.922,48.9747 z"/>
                    </g>
                    <g >
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M158.356,48.9747 C157.403,50.2459,153.558,54.7663,157.227,55.1087 C159.763,55.3454,161.848,52.4296,160.756,50.0996 C160.146,48.7986,159.574,49.5367,158.356,48.9747 z"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M158.356,48.9747 C157.403,50.2459,153.558,54.7663,157.227,55.1087 C159.763,55.3454,161.848,52.4296,160.756,50.0996 C160.146,48.7986,159.574,49.5367,158.356,48.9747 z"/>
                    </g>
                    <g >
                    <path style="fill:#ff7bac;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M138.544,57.315 C140.434,61.0947,142.755,65.1788,146.633,67.285 C156.618,72.7092,169.589,67.0754,171.154,55.3386 C169.944,68.9693,164.08,84.8542,147.502,83.1728 C135.961,82.0023,138.544,64.5372,138.544,57.315 z"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M138.544,57.315 C140.434,61.0947,142.755,65.1788,146.633,67.285 C156.618,72.7092,169.589,67.0754,171.154,55.3386 C169.944,68.9693,164.08,84.8542,147.502,83.1728 C135.961,82.0023,138.544,64.5372,138.544,57.315 z"/>
                    </g>
                    <g >
                    <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M146.138,67.6296 C145.05,68.5499,144.956,69.3787,144.377,70.6163 C145.618,71.4014,147.017,71.7049,148.382,72.1652 C151.219,73.1214,154.667,74.1506,157.687,73.4334 C158.422,73.259,161.573,72.5059,161.673,71.7069 C161.749,71.1063,161.792,68.8713,161.222,68.5274 C160.161,67.8869,157.712,69.2594,156.48,69.3105 C152.911,69.4585,149.389,69.2553,146.138,67.6296 z"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M146.138,67.6296 C145.05,68.5499,144.956,69.3787,144.377,70.6163 C145.618,71.4014,147.017,71.7049,148.382,72.1652 C151.219,73.1214,154.667,74.1506,157.687,73.4334 C158.422,73.259,161.573,72.5059,161.673,71.7069 C161.749,71.1063,161.792,68.8713,161.222,68.5274 C160.161,67.8869,157.712,69.2594,156.48,69.3105 C152.911,69.4585,149.389,69.2553,146.138,67.6296 z"/>
                    </g>
                </g>
                </svg>
                `),
            // simple guy couple of hairs
            () => transformSvg(`
                <svg viewBox="0 0 300 300" >
                <g >
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M153.056,33.1191 C143.12,30.9897,134.667,44.2682,134.436,53.0209 C134.311,57.7146,136.702,61.5461,139.278,65.3037 C143.069,70.8317,148.823,76.6106,155.73,77.8265 C159.517,78.4932,163.478,77.923,167.165,76.9867 C169.693,76.3449,171.819,75.7275,174.044,74.2952 C177.34,72.1732,179.328,69.4724,181.406,66.2586 C184.547,61.404,186.819,55.9665,186.161,50.0131 C184.768,37.4173,174.454,30.5342,162.641,29.5908 C158.772,29.2818,154.368,29.3636,150.75,30.9257 C148.416,31.9337,146.431,34.0808,144.591,35.7797"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M133.343,34.3285 C134.237,36.5636,135.282,38.6552,136.488,40.7383"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M137.455,27.193 C138.375,29.559,139.193,31.9221,139.995,34.3285"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M148.703,32.0306 C147.575,28.4234,146.639,25.1071,145.074,21.6298"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M154.75,29.1281 C155.715,24.6216,159.32,20.9292,162.49,17.7598"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M165.392,29.1281 C167.031,25.1049,168.617,21.0657,170.23,17.0341"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M179.058,35.175 C180.179,30.9727,184.001,29.0235,187.524,26.9512"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M185.347,42.1895 C189.092,41.7214,192.49,39.1636,196.111,37.9566"/>
                    </g>
                    <g >
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M153.419,45.6968 C149.401,46.5004,149.207,51.5832,153.547,52.1852 C156.989,52.6627,156.191,46.9761,153.419,45.6968 z"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M153.419,45.6968 C149.401,46.5004,149.207,51.5832,153.547,52.1852 C156.989,52.6627,156.191,46.9761,153.419,45.6968 z"/>
                    </g>
                    <g >
                    <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M168.779,46.1805 C163.548,45.4333,164.523,53.1846,169.873,51.7601 C173.675,50.7477,171.364,46.6976,168.779,46.1805 z"/>
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-opacity:1;stroke-width:1;" d="M168.779,46.1805 C163.548,45.4333,164.523,53.1846,169.873,51.7601 C173.675,50.7477,171.364,46.6976,168.779,46.1805 z"/>
                    </g>
                    <g >
                    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M154.266,68.1915 C154.859,67.0907,155.571,65.4509,156.821,64.9491 C158.281,64.3633,160.165,66.103,161.865,65.7289 C162.491,65.591,162.84,64.9605,163.444,64.7514 C167.38,63.39,172.373,62.4307,176.035,64.6842"/>
                    </g>
                </g>
                </svg>
                `)


        ]
    },
    bodies: [
        // // Girly dress shruging
        // () => transformSvg(`

        //     `),
        // Girly dress shruging
        () => transformSvg(`
<svg viewBox="0 0 300 300">

    <g >
      <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M148.156,86.046 C149.885,111.98,145.243,138.778,143.072,164.637 C142.521,171.206,141.604,177.719,141.357,184.319 C141.302,185.808,140.119,189.604,141.441,190.672 C143.145,192.048,147.632,191.213,149.709,191.213 C157.02,191.213,164.325,191.496,171.621,191.496 C167.885,179.937,168.02,168.071,167.339,156.382 C166.036,134.039,165.053,111.661,168.228,89.4385"/>
      <path style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M148.156,86.046 C149.885,111.98,145.243,138.778,143.072,164.637 C142.521,171.206,141.604,177.719,141.357,184.319 C141.302,185.808,140.119,189.604,141.441,190.672 C143.145,192.048,147.632,191.213,149.709,191.213 C157.02,191.213,164.325,191.496,171.621,191.496 C167.885,179.937,168.02,168.071,167.339,156.382 C166.036,134.039,165.053,111.661,168.228,89.4385"/>
    </g>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M141.088,192.627 C139.424,219.243,137.347,246.956,144.764,272.916 C138.866,272.181,135.669,273.734,132.427,277.059 C131.623,277.883,129.638,279.881,130.672,281.127 C131.861,282.561,134.822,282.295,136.486,282.572 C143.077,283.665,149.755,281.98,155.789,279.418 C144.839,273.541,143.841,266.24,141.134,255.153 C136.021,234.209,136.62,213.479,141.088,192.627 z"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M169.359,191.496 C166.306,215.918,166.698,245.636,175.296,268.958 C172.911,269.247,163.149,273.448,166.1,277.186 C168.954,280.801,179.608,278.642,183.562,278.225 C184.876,278.087,188.54,278.312,188.709,276.416 C189.476,267.811,175.297,271.468,173.983,266.435 C171.183,255.705,171.287,243.383,170.751,232.365 C170.116,219.304,168.538,204.635,169.359,191.496 z"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M146.743,93.1137 C131.542,101.299,111.865,120.332,115.558,139.795 C117.008,147.439,129.264,149.546,135.12,152.053 C137.26,152.969,142.004,153.493,142.603,156.227 C143.714,161.3,134.84,171.91,130.211,165.935 C125.388,159.71,139.494,156.094,142.785,155.875"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M168.228,101.595 C180.975,112.024,200.959,125.394,216.494,111.63 C222.473,106.333,225.539,91.6712,226.312,83.9015 C226.591,81.1055,223.562,79.0752,224.877,76.0414 C226.031,73.3808,234.671,69.0981,235.951,73.5042 C237.81,79.904,227.724,79.8779,226.292,83.6694 C223.226,91.7918,223.765,100.641,218.611,108.394 C210.329,120.849,190.762,119.666,179.697,112.212 C174.932,109.002,172.443,105.427,168.228,101.595 z"/>
</svg>

        `),
        // jumping stick figure
        () => transformSvg(`
<svg viewBox="0 0 300 300" >
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M158.249,91.8068 C159.241,106.682,156.977,121.459,156.89,136.31 C156.89,121.254,158.249,106.218,158.249,91.1273 C154.446,103.827,156.89,121.386,156.89,134.612 C157.069,119.742,157.57,104.991,157.57,90.1082 C157.57,101.998,157.57,113.889,157.57,125.779 C157.57,129.519,158.929,136.575,157.095,139.885 C154.741,144.132,149.331,147.173,145.861,150.416 C137.511,158.222,129.678,166.034,122.368,174.783 C120.34,177.21,115.36,180.905,114.423,183.812 C113.306,187.273,118.762,192.761,120.259,195.567 C123.318,201.302,133.393,222.944,133.84,228.527 C133.978,230.24,121.787,243.223,119.861,245.701 C124.837,241.515,130.491,236.824,132.77,230.413 C130.633,231.802,129.045,233.643,127.335,235.509"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M160.967,142.425 C168.119,147.67,174.072,154.373,181.35,159.411 C173.904,165.617,172.036,176.973,166.888,184.74 C164.706,188.032,159.415,191.994,158.511,195.806 C157.848,198.598,159.753,204.753,160.967,207.312 C160.127,205.053,159.214,202.853,158.589,200.518 C159.714,202.757,161.035,204.71,163.005,206.293 C160.683,203.671,159.582,200.288,158.249,197.12 C158.515,199.741,159.241,202.518,160.288,204.934 C160.208,201.654,158.982,198.642,158.589,195.422 C159.996,201.044,162.464,206.23,165.044,211.389"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M106.612,72.4426 C109.606,72.4426,112.031,72.4472,114.765,73.8015 C111.389,73.5707,107.892,71.869,104.573,71.0838 C106.626,71.6166,113.737,72.5083,114.803,74.2817 C116.625,77.3111,112.797,85.1719,111.995,88.2759 C108.902,100.243,105.323,113.46,104.233,125.779 C110.56,125.456,119.252,118.205,124.556,114.899 C134.446,108.732,146.17,104.245,156.89,99.6204 C150.085,100.933,144.042,105.993,138.051,109.147 C127.176,114.872,115.547,119.611,104.573,125.099 C102.032,116.492,110.493,96.605,111.894,86.9513 C112.295,84.1824,114.805,77.7713,113.229,75.3048 C111.881,73.1946,108.793,73.4495,106.612,72.4426 z"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M161.307,101.319 C169.846,109.082,176.643,118.313,186.106,125.099 C187.822,116.886,197.143,102.691,201.091,94.4754 C202.288,91.9833,207.17,86.0078,206.485,83.2157 C206.016,81.304,195.913,78.1613,193.92,77.1987 C196.696,78.5432,199.947,79.7673,202.413,81.6151 C199.815,80.3565,197.183,79.1672,194.599,77.8782 C196.955,79.2172,198.987,81.0086,201.394,82.2946 C198.432,81.4279,195.388,79.5239,192.561,78.2179 C197.356,79.7267,203.334,81.8794,207.509,84.6726 C203.156,88.5,201.784,95.0334,199.711,100.175 C195.948,109.507,191.159,118.257,187.126,127.478 C177.963,116.872,170.134,112.108,161.307,101.319 z"/>
</svg>

                    `),
        // stick figure
        () => transformSvg(`
<svg viewBox="0 0 300 300" >

    <path id="Path" style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M157.909,90.1082 C156.655,107.67,155.557,125.734,155.532,143.341 C155.522,150.209,158.074,162.039,155.886,168.331 C153.504,175.182,146.167,180.742,142.381,186.916 C129.917,207.241,116.777,227.225,103.554,247.059"/>
    <path id="Path" style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M156.551,167.904 C165.388,197.953,188.411,220.813,196.977,250.796"/>
    <path id="Path" style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M105.592,118.984 C141.66,116.73,178.191,119.324,214.303,119.324"/>
</svg>

            `),
        // strong stance guy
        () => transformSvg(`
<svg viewBox="0 0 300 300" >
    <path  style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M182.03,96.9026 C185.866,104.027,183.588,112.108,181.764,119.721 C178.113,134.958,176.272,150.821,171.323,165.701 C169.714,170.538,166.327,184.113,159.744,183.831 C153.19,183.55,148.708,171.158,146.881,166.131 C140.928,149.749,139.746,131.676,135.289,114.823 C133.235,107.057,130.84,99.5387,136.167,95.204 C150.122,83.8489,167.453,87.1845,182.03,96.9026 z"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M149.077,174.359 C152.183,181.09,142.334,193.568,139.822,200.998 C132.697,222.082,130.732,243.571,130.732,265.744 C124.652,263.725,104.497,269.853,111.045,278.482 C116.519,285.693,130.591,283.334,135.54,276.78 C139.584,271.425,131.996,268.092,128.693,265.065"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M170.139,170.622 C165.331,188.653,172.414,202.107,178.09,219.063 C182.98,233.671,189.881,245.799,196.298,259.969 C202.629,273.949,178.491,279.398,173.658,271.461 C167.063,260.633,189.599,259.462,194.939,260.988"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M133.45,108.453 C126.942,124.722,123.258,144.915,123.258,162.454 C123.258,165.454,123.516,178.204,126.647,179.594 C130.732,181.408,140.855,177.481,137.293,171.832 C134.437,167.304,129.208,171.595,125.538,170.02 C121.754,168.396,123.706,156.541,123.937,153.296"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M185.767,101.659 C191.476,119.93,198.616,136.661,201.943,155.588 C202.461,158.532,206.318,171.059,203.616,172.609 C200.358,174.477,194.798,173.359,194.039,169.093 C193.206,164.421,198.665,163.006,202.073,161.789"/>
</svg>

            `),
        // large pullover guy
        () => transformSvg(`
        <svg viewBox="0 0 300 300">

            <g >
            <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M182.067,182.001 C167.286,182.385,152.244,183.487,137.483,183.159 C139.152,168.682,141.687,139.372,140.196,125.52 C132.136,135.965,123.3,146,115.489,156.582 C113.725,158.972,108.349,167.988,105.784,168.8 C103.031,169.672,96.3325,162.581,94.3526,162.337 C109.525,139.677,129.54,120.271,144.158,97.2397 C156.337,95.5207,168.902,95.4749,181.186,95.0636 C197.727,110.924,210.35,129.515,227.505,142.037 C226.22,143.278,217.472,152.748,216.907,152.634 C214.076,152.065,210.52,146.215,208.309,144.339 C198.906,136.359,186.968,127.635,180.419,116.986 C179.135,123.328,181.463,130.999,181.765,137.419 C182.5,153.018,181.231,166.399,182.067,182.001 z"/>
            <path style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M182.067,182.001 C167.286,182.385,152.244,183.487,137.483,183.159 C139.152,168.682,141.687,139.372,140.196,125.52 C132.136,135.965,123.3,146,115.489,156.582 C113.725,158.972,108.349,167.988,105.784,168.8 C103.031,169.672,96.3325,162.581,94.3526,162.337 C109.525,139.677,129.54,120.271,144.158,97.2397 C156.337,95.5207,168.902,95.4749,181.186,95.0636 C197.727,110.924,210.35,129.515,227.505,142.037 C226.22,143.278,217.472,152.748,216.907,152.634 C214.076,152.065,210.52,146.215,208.309,144.339 C198.906,136.359,186.968,127.635,180.419,116.986 C179.135,123.328,181.463,130.999,181.765,137.419 C182.5,153.018,181.231,166.399,182.067,182.001 z"/>
            </g>
            <g >
            <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M151.674,187.979 C146.83,193.76,148.202,201.329,147.362,208.555 C145.269,226.555,142.444,245.637,143.782,263.775 C148.676,262.468,163.719,270.431,159.782,276.198 C158.684,277.808,154.429,277.417,152.689,277.565 C143.679,278.335,140.064,271.577,143.496,264.117"/>
            <path style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M151.674,187.979 C146.83,193.76,148.202,201.329,147.362,208.555 C145.269,226.555,142.444,245.637,143.782,263.775 C148.676,262.468,163.719,270.431,159.782,276.198 C158.684,277.808,154.429,277.417,152.689,277.565 C143.679,278.335,140.064,271.577,143.496,264.117"/>
            </g>
            <g >
            <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M171.687,184.946 C172.895,198.649,174.65,212.321,175.293,226.08 C175.706,234.925,174.294,245.677,176.007,254.258 C176.387,256.162,180.953,255.202,182.479,255.562 C186.485,256.508,193.047,262.212,192.873,266.702 C192.701,271.116,183.792,271.224,181.259,269.601 C176.054,266.264,175.477,260.994,175.355,255.286"/>
            <path style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M171.687,184.946 C172.895,198.649,174.65,212.321,175.293,226.08 C175.706,234.925,174.294,245.677,176.007,254.258 C176.387,256.162,180.953,255.202,182.479,255.562 C186.485,256.508,193.047,262.212,192.873,266.702 C192.701,271.116,183.792,271.224,181.259,269.601 C176.054,266.264,175.477,260.994,175.355,255.286"/>
            </g>
        </svg>

        ` ),
        // short guy 
        () => transformSvg(`
            <svg viewBox="0 0 300 300">
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M139.406,87.2947 C134.75,90.3613,141.055,93.662,139.406,98.8313 C136.062,109.317,134.673,117.671,134.35,128.659 C134.179,134.464,131.572,141.959,137.578,144.45 C152.744,150.741,168.455,147.424,184.304,140.961 C186.069,126.306,184.235,114.373,182.03,101.127 C181.153,95.8555,181.714,95.1787,180.072,90.097"/>
                <path style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M139.406,87.2947 C134.75,90.3613,141.055,93.662,139.406,98.8313 C136.062,109.317,134.673,117.671,134.35,128.659 C134.179,134.464,131.572,141.959,137.578,144.45 C152.744,150.741,168.455,147.424,184.304,140.961 C186.069,126.306,184.235,114.373,182.03,101.127 C181.153,95.8555,181.714,95.1787,180.072,90.097"/>
                </g>
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M146.052,149.789 C144.161,157.843,145.494,166.852,145.351,175.138 C145.315,177.248,146.026,180.204,145.526,182.202 C144.671,185.624,138.863,191.022,136.647,194.003"/>
                </g>
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M171.511,147.577 C169.853,154.003,170.525,161.507,170.414,168.157 C170.374,170.605,169.964,174.275,171.049,176.535 C172.14,178.808,175.446,180.214,177.513,181.411"/>
                </g>
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M137.314,98.8313 C133.195,102.658,128.757,107.574,125.858,112.433 C124.166,115.271,122.418,120.552,119.535,122.374 C118.167,123.238,117.033,120.041,116.559,119.182 C115.039,116.426,110.342,110.578,112.448,108.073 C110.57,112.018,102.769,116.695,99.1442,112.948 C99.1442,112.948,102.871,113.877,102.871,113.877"/>
                </g>
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M182.271,96.0887 C184.288,101.723,187.049,108.029,191.253,112.395 C192.399,113.585,194.761,116.169,196.595,115.913 C200,115.437,203.252,106.048,204.434,103.317 C202.862,101.803,202.035,99.7702,200.482,98.2821 C203.566,104.917,208.075,106.79,214.689,103.832"/>
                </g>
            </svg>
        ` ),
        // shy girl dress
        () => transformSvg(`
            <svg viewBox="0 0 300 300">

                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M151.221,88.7478 C145.344,98.5424,142.332,109.533,139.247,120.454 C135.158,134.929,131.245,149.412,128.883,164.323 C127.383,173.793,127.029,183.413,125.918,192.924 C124.93,201.371,125.166,210,124.376,218.488 C124.236,219.994,123.032,226.136,124.347,227.108 C125.081,227.65,126.825,227.319,127.692,227.319 C130.926,227.319,134.139,227.124,137.377,227.124 C149.338,227.124,161.278,227.513,173.214,227.708 C165.893,219.059,166.151,207.925,163.241,197.28 C157.438,176.052,158.228,153.093,158.228,131.239 C158.228,117.335,157.263,102.137,160.174,88.5531"/>
                <path style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M151.221,88.7478 C145.344,98.5424,142.332,109.533,139.247,120.454 C135.158,134.929,131.245,149.412,128.883,164.323 C127.383,173.793,127.029,183.413,125.918,192.924 C124.93,201.371,125.166,210,124.376,218.488 C124.236,219.994,123.032,226.136,124.347,227.108 C125.081,227.65,126.825,227.319,127.692,227.319 C130.926,227.319,134.139,227.124,137.377,227.124 C149.338,227.124,161.278,227.513,173.214,227.708 C165.893,219.059,166.151,207.925,163.241,197.28 C157.438,176.052,158.228,153.093,158.228,131.239 C158.228,117.335,157.263,102.137,160.174,88.5531"/>
                </g>
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M136.43,230.627 C140.746,235.303,141.677,240.246,144.449,245.687 C145.124,247.012,147.691,249.991,146.751,251.496 C143.294,257.032,137.224,261.585,133.09,266.664 C131.992,268.013,128.632,270.634,130.224,272.575 C133.296,276.32,141.39,275.725,145.693,275.995 C147.368,276.1,149.427,276.547,151.047,275.923 C152.818,275.241,153.286,273.067,153.149,271.391 C152.906,268.417,149.654,267.398,147.334,266.55 C140.602,264.088,133.059,266.457,128.84,272.082"/>
                </g>
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M163.677,229.654 C160.102,234.301,158.038,239.599,154.745,244.367 C154.004,245.44,151.23,248.577,151.743,249.913 C152.71,252.432,156.67,255.475,158.452,257.625 C160.815,260.478,162.228,263.987,164.138,267.11 C165.393,269.163,168.135,272.064,166.198,274.413 C163.717,277.421,159.404,277.988,155.905,278.846 C155.1,279.044,152.164,279.725,151.74,278.759 C151.094,277.283,151.785,274.937,152.13,273.461 C153.525,267.488,157.123,263.63,163.093,262.351"/>
                </g>
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M149.47,88.1639 C141.888,97.2614,133.341,105.481,126.286,114.989 C124.963,116.773,124.527,118.996,123.316,120.844 C121.235,124.021,115.74,129.777,116.6,134.018 C116.996,135.972,119.349,137.226,120.752,138.38 C124.089,141.125,127.2,143.845,129.813,147.329"/>
                </g>
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M161.342,88.9424 C168.506,108.049,174.984,127.316,183.334,145.967 C180.608,138.239,180.695,129.816,180.608,121.707 C180.5,111.63,180.45,101.618,181.655,91.5709 C181.882,89.6861,181.854,83.9637,182.953,82.5922 C184.343,80.8577,189.885,78.8243,188.685,75.5198 C187.951,73.4967,184.395,75.2741,183.518,76.142 C180.882,78.7515,180.523,81.2699,181.583,84.6607"/>
                </g>
            </svg>

        ` ),

        // meme stick guy body
        () => transformSvg(`
            <svg viewBox="0 0 300 300" >
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M138.434,87.8295 C137.419,103.056,136.405,118.419,135.793,133.67 C135.559,139.507,133.962,149.539,136.258,154.988 C137.334,157.541,148.801,156.526,151.193,156.526 C163.978,156.526,176.666,155.519,189.356,154.255 C192.108,153.981,196.959,155.06,198.717,152.608 C200.584,150.003,197.904,140.627,197.44,137.582 C195.406,124.236,192.696,112.59,188.241,99.8398 C187.02,96.3435,186.331,87.8944,182.766,85.9894 C179.223,84.097,170.158,90.6778,163.689,90.6778 C155.084,90.6778,153.397,88.4948,138.434,87.8295 z"/>
                <path style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:none;" d="M138.434,87.8295 C137.419,103.056,136.405,118.419,135.793,133.67 C135.559,139.507,133.962,149.539,136.258,154.988 C137.334,157.541,148.801,156.526,151.193,156.526 C163.978,156.526,176.666,155.519,189.356,154.255 C192.108,153.981,196.959,155.06,198.717,152.608 C200.584,150.003,197.904,140.627,197.44,137.582 C195.406,124.236,192.696,112.59,188.241,99.8398 C187.02,96.3435,186.331,87.8944,182.766,85.9894 C179.223,84.097,170.158,90.6778,163.689,90.6778 C155.084,90.6778,153.397,88.4948,138.434,87.8295 z"/>
                </g>
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M138.434,87.8295 C136.256,95.9971,135.78,104.33,134.049,112.576 C131.992,122.381,128.813,131.956,129.441,142.134 C130.253,155.297,135.427,168.034,136.688,181.268"/>
                </g>
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M186.068,85.9894 C202.663,112.085,206.638,146.203,206.638,170.748"/>
                </g>
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M140.916,158.022 C142.588,165.382,142.756,168.67,143.867,175.639 C145.14,183.613,144.938,191.892,146.049,199.936 C149.125,222.21,146.876,244.242,146.876,266.556"/>
                </g>
                <g >
                <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:4;" d="M195.318,156.725 C195.318,175.952,194.797,194.253,195.5,213.48 C195.678,218.36,197.253,223.367,197.735,228.269 C199.031,241.469,199.562,255.034,199.562,268.302"/>
                </g>
            </svg>

        `),

        // Girly dress shruging
        () => transformSvg(
            `
            <svg viewBox="0 0 300 300" >
            <g >
                <path  style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M150.285,89.7047 C146.383,94.4743,145.921,102.002,144.057,107.853 C138.821,124.286,135.759,141.645,131.283,158.351 C129.897,163.525,128.14,168.503,126.355,173.539 C125.954,174.671,124.202,177.84,124.765,178.969 C125.102,179.644,127.233,179.798,127.916,179.974 C131.368,180.864,135.248,180.58,138.792,181.068 C149.756,182.577,160.734,184.864,171.679,186.582 C174.867,187.083,181.61,189.433,184.633,188.386 C185.99,187.916,184.469,182.881,184.381,181.757 C183.83,174.686,181.141,166.448,178.991,159.687 C175.809,149.68,172.08,139.314,170.028,128.999 C168.538,121.507,168.914,113.89,166.88,106.445 C165.871,102.75,165.451,98.5777,165.385,94.771 C165.366,93.6841,165.571,90.8195,164.687,90.0771 C162.144,87.9419,153.733,90.6897,150.285,89.7047 z"/>
                <path  style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M137.014,182.142 C134.9,190.07,138.09,200.265,137.673,208.675 C137.132,219.614,134.968,230.516,133.011,241.269 C131.494,249.602,130.553,257.811,127.862,265.884"/>
                <path  style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M177.055,186.718 C174.918,195.264,175.682,204.593,175.682,213.352 C175.682,229.935,174.309,250.287,181.402,265.656"/>
                <path  style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M126.947,267.486 C131.259,275.033,137.647,277.669,146.229,276.394 C148.194,276.102,152.275,276.621,153.283,274.399 C154.204,272.368,153.039,269.715,152.267,267.853 C148.771,259.416,139.318,258.471,131.752,261.308"/>
                <path  style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M181.174,265.656 C186.047,270.529,191.391,269.51,197.803,268.372 C200.395,267.912,204.657,267.087,204.489,263.672 C204.312,260.053,199.929,256.463,196.95,255.102 C189.458,251.677,183.521,251.747,177.742,258.105"/>
                <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M147.539,95.8825 C143.759,100.293,141.62,105.55,138.29,110.258 C129.693,122.408,121.374,134.836,112.99,147.135 C108.886,135.721,108.058,120.434,108.702,108.39 C109.146,100.095,110.847,90.462,103.38,85.1286"/>
                <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M166.759,99.3145 C174.455,109.576,179.231,123.419,183.84,135.361 C185.678,140.125,186.835,144.872,189.639,149.194 C190.989,141.945,190.131,134.015,190.962,126.627 C193.303,105.83,199.895,88.5948,215.952,74.8324"/>
                <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M104.753,89.7047 C98.3714,90.8308,92.4001,96.0237,92.3974,102.975 C97.8163,103.742,102.101,101.656,107.27,100.687"/>
                <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M207.029,87.6455 C211.028,89.7991,215.342,91.3029,219.741,89.0677 C225.294,86.2463,220.573,80.9381,216.638,80.0949"/>
            </g>
            </svg>
            `
        ),
        () => transformSvg(
            `
                <svg viewBox="0 0 300 300">
                <g >
                    <path style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M147.653,89.3753 C147.653,110.18,140.868,129.621,136.132,149.627 C134.377,157.042,130.543,165.145,131.147,172.844 C131.622,178.908,136.308,184.041,141.095,187.223 C150.35,193.378,162.125,196.613,173.313,195.086 C188.47,193.016,188.363,178.115,187.252,165.905 C186.656,159.353,186.809,153.171,184.98,146.742 C183.304,140.849,180.123,135.388,177.789,129.737 C172.835,117.743,167.628,102.997,166.91,90.055"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M170.081,97.3045 C171.882,99.2848,174.493,100.95,175.913,103.195 C182.191,113.129,183.269,125.713,186.5,136.815 C188.906,145.081,192.918,153.168,195.967,161.232 C198.209,167.16,199.488,173.688,203.611,178.635"/>
                    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M147.88,94.3594 C137.777,93.7279,135.295,108.232,133.03,115.861 C125.619,140.828,123.14,166.936,114.35,191.549"/>
                    <path  style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M144.255,189.057 C142.738,200.437,144.556,212.131,143.531,223.58 C142.355,236.729,138.846,249.549,137.524,262.641 C136.831,269.508,132.169,282.465,141.253,285.341 C146.64,287.047,156.562,284.675,156.229,277.601 C155.941,271.477,144.135,266.673,139.044,266.31"/>
                    <path  style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M177.557,196.533 C177.557,205.475,176.037,214.382,175.973,223.356 C175.893,234.482,177.307,245.688,176.626,256.808 C176.301,262.118,173.813,275.859,178.805,279.422 C185.464,284.174,193.05,279.814,198.067,275.276 C200.348,273.212,203.308,271.341,203.138,267.876 C202.961,264.269,199.091,261.694,196.13,260.382 C189.666,257.519,185.568,255.206,178.69,258.154"/>
                </g>
                </svg>

            `
        ),
        () => transformSvg(
            `
            <svg viewBox="0 0 300 300" >
  <g >
    <path  style="fill:#aaaaaa;fill-opacity:1;fill-rule:nonzero;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M149.37,90.8488 C143.129,112.691,135.994,133.375,119.789,150.169 C113.918,156.253,106.673,161.895,99.934,167.008 C95.2652,170.55,89.9999,173.617,86.3972,178.411 C82.024,184.23,86.9356,191.444,92.3571,194.431 C94.781,195.766,98.2673,196.541,100.971,197.144 C126.457,202.821,143.654,175.324,151.272,154.383 C152.779,150.239,154.576,146.213,155.651,141.917 C157.034,136.384,158.665,130.737,159.172,125.045 C159.913,116.728,161.725,108.78,161.725,100.319 C161.725,98.1025,162.389,93.2629,160.792,91.47 C159.542,90.066,151.234,90.8488,149.37,90.8488 z"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M117.337,197.472 C122.173,210.367,131.527,220.668,139.513,231.622 C142.716,236.015,144.668,241.611,148.455,245.521 C138.832,253.611,136.253,265.693,133.269,277.661 C132.768,279.669,129.775,286.599,130.532,288.293 C131.214,289.819,134.308,290.015,135.685,290.151 C139.732,290.553,150.595,291.66,152.724,286.982 C155.916,279.97,141.768,278.231,137.93,277.553"/>
    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M87.1349,193.811 C75.4506,196.148,63.8766,203.451,52.9643,208.21 C47.9769,210.385,41.9811,213.38,36.4682,213 C27.5045,212.381,23.509,203.789,20.0281,196.645 C11.293,178.719,11.0354,155.536,13.6885,136.381 C14.8783,127.791,18.1154,121.577,19.7897,115.073 C20.2365,113.337,22.6003,109.169,21.6234,107.438 C20.7113,105.821,17.3092,105.889,15.7604,105.962 C12.7545,106.105,10.5653,108.76,8.65097,110.845 C-0.832146,121.173,5.25858,132.069,13.6885,140.499"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M164.242,111.441 C173.406,116.376,183.512,112.39,192.239,108.358 C210.019,100.146,226.276,90.6154,242.322,79.2924 C244.373,77.845,248.226,74.4522,250.578,73.8797 C255.216,72.7509,257.549,73.833,261.484,70.2563"/>
    <path style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M247.985,74.8324 C249.483,69.5865,256.495,60.5003,263.177,62.353 C267.944,63.6748,263.173,68.5308,261.713,70.2563"/>
    <path  style="fill:none;opacity:1;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-width:3;" d="M144.282,103.51 C137.773,105.68,130.593,107.295,123.672,106.722 C105.344,105.205,93.17,88.9444,78.0962,80.5219 C72.9738,77.6597,61.6305,82.9443,58.3654,77.0047 C56.9446,74.4202,55.4425,60.1624,58.9548,59.2396 C67.0338,57.1169,75.8826,69.8895,78.5548,75.6793"/>
  </g>
</svg>

            `
        )
    ]
};

export const renderSVG = (Component, styleOverrides = {}, isHead = false) => {
    if (typeof Component === 'function') {
        return Component(styleOverrides, isHead);
    }
    return Component;
};

export default SVGComponents;