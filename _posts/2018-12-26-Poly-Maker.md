---
layout: post
title:  "Poly Maker 2D with Python and PyQt"
date:   2018-12-04 21:12:00 -0700
categories: test
tags: [python, pyqt, qt, math]
---

<!-- Post Banner -->
<figure class="figure  pb-5">
  <a href="{{page.url | absolute_url}}">
  <img src="{{ '/assets/img/blog/polyMaker/banner.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  </a>
</figure>
 <!--more-->

<p>
  Here is my new Poly Maker 2D tool that actually does nothing important and unfortunately doesn't change people's life. But! It was fun to write it and play with results. Inspired by "Poly Maker" tool written by Paul Lewis. I believe the original tool was written with JavaScripts and WebGL. As there were no sources, I decided to write my own real time version with Python and PyQt. The project is available here. So fork it, break it or improve it if you wish. Let's go!
</p>

<h4 class="mt-5 mb-4">The catch</h4>

<figure class="figure  pb-5">
  <a href="{{page.url | absolute_url}}">
  <img src="{{ '/assets/img/blog/polyMaker/01.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Bezier curve with 20 steps of interpolation</figcaption>
  </a>
</figure>

<p>
I've never used my website as I was intending to. 10 years ago, when I was a student, I was thinking about a personal website with some blog and a gallery (I do CG stuff sometimes), contact page, terms of use, personal data base etc. And that's how I jumped into front-end web dev (and back-end after a few years). I did many things - I used Macromedia Flash, I did PNG pictures with colored words instead of using CSS "color" :D I gradually moved to what I call "Neither Seen Nor Recognized" (one of my favourite film with  Louis de Funes), that means "grab everything you can see from other websites' sources and use it on your own slightly changed". By doing that I studied JS, jQuery, HTML, CSS, php, mySQL, Flask and many other things. And you know what was funny? Again. I have never used my website as I intended to. Just because I didn't have enough content to show off. And I spent hundreds of US dollars just to get my website run being almost empty of any content all the time. 
</p>

<figure class="figure  pb-5">
  <a href="{{page.url | absolute_url}}">
  <img src="{{ '/assets/img/blog/polyMaker/02.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Perpendicular dots with a maximum offset in the middle of the curve</figcaption>
  </a>
</figure>

<p>
I think I did it because I was following the trend - <em>if you are a programmer or a CG artist - do some blog, post tutorials, be like everyone, and even better - get some youtube channel. Doesn't matter if there are hundreds or thousands of people posting just the same beginner thing all the time. Do it as well.</em> I see it happening all the time. But I didn't post too many tutorials as I knew that it should be something that is totally mine. My own thing. My own projects. That nobody will find anywhere but my website.
</p>

<figure class="figure  pb-5">
  <a href="{{page.url | absolute_url}}">
  <img src="{{ '/assets/img/blog/polyMaker/03.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Increased number of the perpendicular dots</figcaption>
  </a>
</figure>

<p>Take into account that during the last year (now it's 2018 on my side. If it's 2027 on your side - find me and ask me delete this article) I didn't have anything on my website but the "About" page. Mostly for people who somehow got lost on the Internet and found my website, entering weird characters on their keyboard by head because there is nothing left they haven't seen yet and they are bored.</p>



<figure class="figure  pb-5">
  <a href="{{page.url | absolute_url}}">
  <img src="{{ '/assets/img/blog/polyMaker/04.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Increased number of the perpendicular dots</figcaption>
  </a>
</figure>
    


{% highlight python  linenos%}
from QtTextEditor import QtWidgets, QtGui, QtCore
from .statusBar import StatusBar


import os

PROJECT_ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.realpath(__file__)), '..')) #Projects path

class MyApp(QtWidgets.QMainWindow):
    '''
    Main TextEditor class
    '''

    def __init__(self):
        super(MyApp, self).__init__()

        self.fileBasename = "Untitled"
        self.filePath = None
        self._CHAR_MAX = 140
      
        self.settings = QtCore.QSettings("RomanVolodin", "QtTextEditor")

        self.setupUI()
        self.restoreSettings()
{% endhighlight %}

<figure class="figure  pb-5">
  <a href="{{page.url | absolute_url}}">
  <img src="{{ '/assets/img/blog/polyMaker/05.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Jitter effect applied to the perpendicular dots</figcaption>
  </a>
</figure>


  <p class="lead">
  You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.
  </p>

<figure class="figure  pb-5">
  <a href="{{page.url | absolute_url}}">
  <img src="{{ '/assets/img/blog/polyMaker/06.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Jitter effect applied to the perpendicular dots</figcaption>
  </a>
</figure>

<figure class="figure  pb-5">
  <a href="{{page.url | absolute_url}}">
  <img src="{{ '/assets/img/blog/polyMaker/07.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Jitter effect applied to the perpendicular dots</figcaption>
  </a>
</figure>

<figure class="figure  pb-5">
  <a href="{{page.url | absolute_url}}">
  <img src="{{ '/assets/img/blog/polyMaker/08.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Jitter effect applied to the perpendicular dots</figcaption>
  </a>
</figure>

  <h4>Having fun</h4>

  <figure class="figure  py-5">
  <a href="{{page.url | absolute_url}}">
  <img src="{{ '/assets/img/blog/polyMaker/09.jpg' | absolute_url }}" class="img-fluid w-100 pb-1" alt="Responsive image">
  <figcaption class="figure-caption text-center">Mona Lisa under Delauney triangulation</figcaption>
  </a>
</figure>



