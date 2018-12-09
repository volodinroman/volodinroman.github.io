---
layout: post
title:  "My new open source website or how GitHub saved my money"
date:   2018-12-04 21:12:00 -0700
categories: test
tags: [test, jekyll, github]
---


<!-- <section id="blog-posts" class="bg-white text-dark"> -->
  <!-- <div class="container fill-viewport-70 px-0"> -->
    
  <figure class="figure">
    <img src="{{ '/assets/img/test.jpg' | absolute_url }}" class="img-responsive w-100 pb-1" alt="Responsive image">
    <figcaption class="figure-caption text-center pb-5">A caption for the above image.</figcaption>
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


  <p class="lead">
  You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.
  </p>

  <h4>Sub Title</h4>

  <p>
    You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.
  </p>



  <!-- </div> -->


<!-- </section> -->
