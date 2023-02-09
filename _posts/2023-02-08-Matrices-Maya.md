---
layout: post
title:  "Matrices in Maya"
date:   2023-02-08 21:12:00 -0700
categories: math
tags: [Math, Maya, Linear Algebra, Matrices, Python]
---


<h3 class="mt-3 mb-4">Why I wrote this article</h3>

<p class="pt-4">
If you are reading this, you probably heard about matrices and their use in computer graphics. I started my programming journey in Maya with MEL and then moved on to Python. My curiosity for learning more led me to experiment with Python API (OpenMaya) and later with C++ Plugins for Maya. Vectors and matrices were everywhere. If I could learn vectors math in a couple of days, matrices were a persistent challenge for me. Despite searching for a comprehensive article or a youtube video about matrices in Maya, I was unable to find one that fully addressed my needs. Well, now I know matrices. But when I talk to my students or colleagues, I feel their fear when we start talking about matrices in Maya. 
</p>

<p>
This article is written for individuals who already have some programming experience in Maya. It is assumed that you  understand basic Python, classes, a bit of OpenMaya. <b>The idea is - you go here, you learn matrices, you don't have to go anywhere else</b>. You are here to receive a comprehensive explanation of matrices in simple terms, without the use of complex mathematical formulas or concepts. Practical examples are included and can be easily copy-pasted into the Maya ScriptEditor for testing. Let's get started!
</p>

<p>Feel free to use this article as a reference with code snippets. Because I will!</p>



<h3 class="mt-5 mb-4">What is a transformation matrix</h3>

A transformation matrix is used to represent an object's <b>position</b>, <b>rotation</b>, and <b>scale</b> in space because it provides a compact and efficient way of encoding these transformations into a single matrix.


<div class="py-4">
{% highlight python  linenos%}
import maya.api.OpenMaya as OpenMaya

selection_list = om.MSelectionList()
selection_list.add("pCube1")
dag_path = selection_list.getDagPath(0)
world_matrix = dag_path.inclusiveMatrix() 
{% endhighlight %}
</div>

<div class="py-4">
```python
import maya.api.OpenMaya as OpenMaya

selection_list = om.MSelectionList()
selection_list.add("pCube1")
dag_path = selection_list.getDagPath(0)
world_matrix = dag_path.inclusiveMatrix() 
```
</div>