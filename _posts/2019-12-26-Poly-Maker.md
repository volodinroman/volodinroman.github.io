---
layout: post
title:  "2D Poly Maker in Python & PyQt"
date:   2019-12-26 21:12:00 -0700
categories: projects
tags: [Python, PyQt, Qt, Math]
---

<!-- Post Banner -->
<figure class="figure">
  <a href="{{page.url | absolute_url}}">
  <img src="{{ '/assets/img/blog/polyMaker/banner.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  </a>
</figure>
 <!--more-->

<p class="pt-4">
  Here is one of my creations, the <b>Poly Maker 2D</b> tool. While it may not have any significant impact or improve anyone's daily life, the process of creating it was enjoyable and fulfilling. I was inspired by Paul Lewis' original <a target="_blank" class="text-info" href="https://aerotwist.com/lab/poly-maker/"><b>Poly Maker</b></a> tool, which was written using JavaScripts and WebGL. However, as the source code was not available, I decided to take on the challenge and build my own real-time version using Python and PyQt. Feel free to fork, modify, or enhance the code as you see fit.
</p>

<a target = "_blank" href="https://github.com/volodinroman/PyPoly2d">
  <button type="button" class="btn btn-dark my-5">GitHub Project</button>
</a>

<h3 class="mt-5 mb-4">Bezier curve</h3>

<figure class="figure  py-5">
  <img src="{{ '/assets/img/blog/polyMaker/01.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Bezier curve with 20 steps of interpolation</figcaption>
</figure>

<p>
  In computer graphics, a Bezier curve is a powerful tool for creating procedural shapes. It works by using entry data, such as starting points, to calculate all the in-between points. To get started, I placed 4 points manually on the canvas. There are various ways to create a Bezier curve, but I went with a cubic one, which requires a minimum of 4 points to define the curve and passes through the first and last points. For a more in-depth explanation of Bezier curves, you can check out this <a target="_blank" class="text-info" href="https://en.wikipedia.org/wiki/B%C3%A9zier_curve"><b>resource</b></a>. But if you want to save your time, the equations to calculate the coordinates of a Bezier curve points are presented below.
</p>

<figure class="figure text-center py-4" style="display: block;">
  <img src="{{ '/assets/img/blog/polyMaker/01.svg' | absolute_url }}" class="pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Bezier curve points coordinates (for each point <b>t</b>)</figcaption>
</figure>

<figure class="figure text-center py-4" style="display: block;">
  <img src="{{ '/assets/img/blog/polyMaker/02.svg' | absolute_url }}" class="pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Bernstein basis polynomials of degree n</figcaption>
</figure>

<figure class="figure text-center py-4" style="display: block;">
  <img src="{{ '/assets/img/blog/polyMaker/03.svg' | absolute_url }}" class="pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Binomial coefficient</figcaption>
</figure>

<p>
The following code is a Python implementation of these equations.
</p>

<div class="py-4">
{% highlight python  linenos%}
import math

def binomial(i, n):
    """Binomial coefficient"""
    return math.factorial(n) / float(math.factorial(i) * math.factorial(n - i))
    
def bernstein(t, i, n):
    """Bernstein basis polynomial"""
    return binomial(i, n) * (t ** i) * ((1 - t) ** (n - i))

def bezier(t, points):
    """Per each iteration calculate curve point coordinates"""
    n = len(points) - 1
    x = 0
    y = 0
    for i, pos in enumerate(points):
        b = bernstein(t, i, n)
        x += pos[0] * b
        y += pos[1] * b
        
    return round(x,4), round(y,4)

def bezierCurve(n, points):
    """Bezier curve points generator"""
    for i in range(n):
        t = i / float(n - 1)
        yield bezier(t, points)
{% endhighlight %}
</div>

<h3 class="my-4">Grid points</h3>

<p>
Before generating polygons along the curve, we generate a set of points placed along the curve normals. This step is crucial as it establishes a grid of points that will serve as the foundation for our Delaunay triangulation algorithm. The tool works in real-time, allowing for dynamic adjustments to be made. Whenever we move a control point (represented by pink squares), all the grid points are recalculated. This is where linear algebra comes into play. To find normal vectors in each segment point of our Bezier curve, I calculated a cross-product of <b>Tangent</b> vectors (the lines between points) and <b>Up</b> vector <i>[0,0,1]</i>. The resulting vectors were normalized. Then I generated points along the normals (on both sides of the curve), with points closer to the centre of our curve being shifted more than the points closer to the curve ends.
</p>

<figure class="figure  py-4">
  <img src="{{ '/assets/img/blog/polyMaker/03.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">A grid of points generated along normals</figcaption>
</figure>

<h3 class="my-5">Delauney triangulation</h3>

<p>
In order to connect points into triangles I used <a target="_blank" class="text-info" href="https://matplotlib.org/api/tri_api.html"><b>matplotlib</b></a> module that has everything we need to calculate a set of triangles using the given set of points. It uses <a target="_blank" class="text-info" href="https://en.wikipedia.org/wiki/Delaunay_triangulation"><b>Delauney triangulation</b></a> algorithm and works pretty fast. 
</p>

<figure class="figure  py-3">
  <img src="{{ '/assets/img/blog/polyMaker/04.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">The grid of points is triangulated</figcaption>
</figure>
    

<p>But it's not exactly what I want. So I added a jitter effect in order to move points using some random directions and offsets.</p>

<figure class="figure  pt-3 pb-5">
  <img src="{{ '/assets/img/blog/polyMaker/05.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Jitter effect has been applied to the points</figcaption>
</figure>


<h3 class="my-5">Coloring the polygons</h3>

<p>
For coloring the polygons the first thing I did was adding some color gradient based on the Y coordinates of each triangle's centroid. It worked but I wanted something more advanced like grabbing colors from a random image. So I googled some samples and found a few interesting ones. In order to be able to recalculate triangles colors when I move my control points I decided to use a <a target="_blank" class="text-info" href="http://doc.qt.io/qt-5/qpixmap.html"><b>QPixmap</b></a> and <a target="_blank" class="text-info" href="http://doc.qt.io/qt-5/qimage.html"><b>QImage</b></a> classes. First thing I did was calculating the width and the height of my lowpoly mesh and resize a given image so it's size could match the size of the mesh. Next thing was mapping triangles centroids coordinates to the image so I could grab a pixel color. Then I used this color as a brush color for painting polygons. And it worked. If you run the project and set any image - you will see how colors of the polygons are changing when we move Control Points.
</p>

<figure class="figure  py-5">
  <img src="{{ '/assets/img/blog/polyMaker/06.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Coloring the triangles</figcaption>
</figure>

<p>
Adding shadow didn't take too much time as it was similar to the coloring procedure. I've just calculated the width of the lowpoly mesh and resized my <a target="_blank" class="text-info" href="http://doc.qt.io/archives/qt-4.8/qgraphicspixmapitem.html"><b>QGraphicsPixmapItem</b></a> object that keeps a reference to the shadow image file. The height of the shadow is fixed and positioned at the fixed Y position.
<p>

<figure class="figure  py-5">
  <img src="{{ '/assets/img/blog/polyMaker/07.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Added a shadow effect</figcaption>
</figure>


<h3 class="py-5">Using another sample image</h3>

<figure class="figure ">
  <a href="{{page.url | absolute_url}}">
  <img src="{{ '/assets/img/blog/polyMaker/09.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Mona Lisa. Tirangulated and colored.</figcaption>
  </a>
</figure>

<!-- <div class="fb-share-button" data-href="https://romanvolodin.com/test/2018/12/05/Poly-Maker.html" data-layout="button_count" data-size="large" data-mobile-iframe="true"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fromanvolodin.com%2Ftest%2F2018%2F12%2F05%2FPoly-Maker.html&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div> -->



