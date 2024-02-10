---
layout: post
title:  "Introduction to Matrices in Maya"
date:   2024-02-02 05:00:00 -0700
categories: math
github: "https://github.com/volodinroman/matrices-in-maya"
tags: [OpenMaya API, Maya, Math, Matrices, Python]
image: '../assets/img/blog/deepdive_matrix/banner.jpg'
intro: "This guide simplifies matrix concepts for artists new to scripting, using practical examples and minimal complex math."
---



<section class="post-body bg-cross padding-up-3">
<div class="container max-width-1000 bg-content font-grey-800 ">

<h3>Overview</h3>

<p>Maya offers extensive capabilities for artists and technical experts, significantly enhanced by its API for custom tool and plugin development. However, grasping matrices—a core component of 3D graphics—remains challenging for developers, especially those with limited math skills. Mastering matrices is vital for leveraging Maya's full potential. This article focuses on practical matrix applications in Maya, avoiding complex mathematical details. It's beneficial for readers with basic Python skills, familiarity with object-oriented programming, and experience with Maya's Python API.</p>

<h3>What is a transformation matrix</h3>

<p>A transformation matrix is used to represent an object's <b>position</b>, <b>rotation</b>, and <b>scale</b> in space because it provides a compact and efficient way of encoding these transformations into a single unit - matrix. When we <b>multiply matrices</b>, we combine transformations into a final matrix. The order of multiplication is crucial factor in determining the resulting transformation. Just imagine, if you rotate an object several times around a random axis in Maya viewport and then repeat the same rotations but in a different order will produce different results. At the end, we apply the resulting matrix to an object (it can also be a point or a vector).</p>

<p>If you are a Maya user, you use matrices in every project. A good example of a matrix is a <b>transformation node</b> (or a <b>group</b> in the Maya Outliner). Groups are a convenient way to organize a Maya scene. At the same time, they serve as a hierarchy of transformations. Every group has its own transformation matrix. When you create a hierarchy of groups and place a Cube under it, the final position and rotation of the Cube is the result of multiplying the matrices of all groups, including the Cube's own matrix.</p>


<figure class="figure">
  <img src="{{ '/assets/img/blog/deepdive_matrix/groups.png' | absolute_url }}" class="img-fluid" alt="...">
  <figcaption class="figure-caption text-center">Cube position is a result of group3.matrix * group2.matrix * group1.matrix * cubeTransform.matrix</figcaption>
</figure>

<p>A transformation matrix is composed of 16 floating-point numbers. Each number represents a different aspect of the transformation being applied. There are a lot of articles explaining what each number means and how to get/set, for example, rotations values from the matrix. But, if we know how to use Maya Python API (or any other API), we can easily extract values (rotation, position, scale etc.) from the matrix with just one command.</p>

<p>Lets check how we can retrieve an object's world matrix using Maya Python API and extract object's coordinates from it:</p>

<div class="code-block">
<pre><button class="copy-btn"><i class="fas fa-copy"></i></button><code class="language-python"># Import Maya commands and OpenMaya API
import maya.cmds as cmds
import maya.api.OpenMaya as OpenMaya

# Create a selection list and add an object to it
selection_list = OpenMaya.MSelectionList()
selection_list.add("pCube1")  # Add 'pCube1' to the selection list

# Retrieve the DAG path of the first object in the selection list
dagPath_Cube = selection_list.getDagPath(0)

# Get the world matrix of the object
# This matrix is not a transformation matrix yet, instead it's more a mathematical entity
world_matrix = dagPath_Cube.inclusiveMatrix()

# Extract translation values from the matrix
# For that we convert a matrix into a transformation matrix 
# in order to get access to a set of useful commands (for example "translation")
transformation_matrix = OpenMaya.MTransformationMatrix(world_matrix)
translation = transformation_matrix.translation(OpenMaya.MSpace.kWorld)

# Print the coordinates values
print(translation)  # Output: (-0.875594, 1.21776, 0.309122) - this is where our object is located in Maya scene</code></pre>
</div>

<p>An <b>Identity</b> matrix is an empty matrix that represents zero transformations. We typically do not apply it to an object (<i>If we apply it to an object - that object won't change its position at all</i>), but it can serve as a starting point where we can set, for example, only rotation or translation values. For instance, if we have specific coordinates and wish to move our object to that position while preserving its rotation and scale, we create an Identity matrix, set the translation (now our identity matrix becomes a translation matrix), and multiply the object matrix by the translation matrix.</p>

<div class="alert alert-secondary" role="alert">
  <p>Translation, rotation, and scaling matrices must be multiplied in the order <b>Scale * Rotate * Translate</b>. This order ensures predictable object translations and helps prevent any unwanted deformations (unless you intentionally want to achieve a different result). Thus, if we first rotate the object and then scale, we can accidentially squash it. It's funny, but pointless.</p>
</div>

<p>If we want to <a target="_blank" class="text-info" href="https://github.com/volodinroman/matrices-in-maya/blob/main/src/move_object_up_and_undo.py">reverse</a> the transformation of our objects, we can take the matrix we used to transform our object and <b>invert</b> it. Then, we multiply our object's matrix by the inverted matrix. Inverse matrices are also helpful for converting between different coordinate spaces in Maya, which we will discuss later.</p>

<img src="{{ '/assets/img/blog/deepdive_matrix/inversed.png' | absolute_url }}" class="img-fluid" alt="...">

<p>Matrices can be modified and multiplied in various ways to achieve a range of effects. For instance, we can rotate an object around a particular point or axis in space, and position it on the surface of another object.</p>

<h3>Object, Local and World Spaces</h3>

<p>In Maya, <b>World</b>, <b>Local</b>, and <b>Object</b> spaces are three different coordinate systems that make it possible to visualize and manipulate objects in the Viewport.</p>

<img src="{{ '/assets/img/blog/deepdive_matrix/spaces.png' | absolute_url }}" class="img-fluid" alt="...">

<p><b>World</b> and <b>Local</b> spaces are used to represent the position, orientation, and scale of an individual object. We can say that a transformation matrix is a coordinate system (and vice versa). When we apply a matrix to an object, we modify object's position and orientation, but it doesn't actually move the object's vertices. Instead, it modifies a coordinate system of the object and Maya Viewport just redraws it in its new location. Magic!</p>


<p><b>World space</b> is the global position of an object in the Maya scene, where the origin is located at the center of the grid. The world matrix represents the global position of the object.</p>

<p><b>Local space</b> is a bit more complex concept in Maya. Every object in the Viewport can be selected and manipulated individually thanks to its parent - a <b>transform node</b>. This node provides the object with its own coordinate system, known as the Local space. <b>Moving the object means moving its coordinate system</b>, while the mesh vertices remains unchanged in their space. If the object has no parent, its Local and World spaces are equivalent. Objects can be placed within other groups (transform nodes) in Maya, creating a hierarchy of transformations where a child group inherits its parent's transformations while also having its own transformations. This hierarchical structure is what makes it possible to manipulate objects in Maya Viewport in a complex way (think about any rigged character).</p>

<p><b>Object space</b> is a coordinate system that exists within a polygonal mesh. Each vertex of the mesh resides in the Object space. If the mesh (its transform node) is moved, its vertices' coordinates remain unchanged, as the Object space follows the Local space. This means that, from Maya perspective, the vertices stay in the same positions. However, if an individual vertex is moved, it will have a new coordinate, and the mesh is considered as deformed. The Object space origin is initially located at the center of the mesh.</p>

<p><b>Pivot</b> is a key aspect in object transformations in Maya. Every object in the Viewport has its own <b>Pivot</b>, which serves as a reference point for operations like moving, rotating or scaling. When we perform a transformation on an object, it takes place around the object's pivot.</p>

<div class="alert alert-secondary" role="alert">
  <p><b>Fact 1.</b> if we apply skinning to our object and animate it, each vertex of the mesh will follow a corresponding bone. In other words, we take a transformation matrix of a bone and apply it to each vertex (preserving the offset of the vertex from the bone origin). This is why animation can be one of the performance bottlenecks, as it's CPU intensive and has a huge impact on FPS.</p>
</div>

<div class="alert alert-secondary" role="alert">
  <p><b>Fact 2.</b> When querying vertex position or normal vector, OpenMaya returns the coordinates in <b>object space</b> by default. We can obtain the global coordinate of a vertex (or any other component) by multiplying its local coordinate by the <b>object's world matrix</b>. A <b>transform node</b> makes it simple to retrieve the world matrix for an object.</p>
</div>

<p>With Maya Python API we can easily retrieve an object's vertex position in world space coordinates (full code is <a target="_blank" class="text-info" href="https://github.com/volodinroman/maya-matrix-math/blob/main/src/get_point_world_position.py">here</a>):</p>

<div class="code-block">
<pre><button class="copy-btn"><i class="fas fa-copy"></i></button><code class="language-python">world_matrix = get_world_matrix(object_name)
vertex_iterator = OpenMaya.MItMeshVertex(object_name)

while not vertex_iterator.isDone():
    local_position = vertex_iterator.position(OpenMaya.MSpace.kObject)  # Object Space position
    world_position = local_position * world_matrix  # Convert to World Space position
    print(f"Object space: {local_position}, World space: {world_position}")
    vertex_iterator.next()</code></pre>
</div>

<h3>What about vectors?</h3>

<p>Computer graphics heavily rely on vector math. Vectors serve the fundamental purpose of representing direction. A transformation matrix, being a 3D coordinate system, stores information about rotation. It is possible to obtain the individual axes from the matrix. Conversely, if the directions of all three axes (represented by three perpendicular vectors) are known, a transformation matrix can be constructed from them.</p>

    
<p>As an illustration, to find the Z-axis world direction of an object as an MVector, we multiply a vector (0, 0, 1) by the object's world matrix.</p>

<div class="code-block">
<pre><button class="copy-btn"><i class="fas fa-copy"></i></button><code class="language-python">import maya.api.OpenMaya as OpenMaya
  
world_matrix = dag_path.inclusiveMatrix() # get world matrix from an object's DagPath
z_axis = OpenMaya.MVector(0,0,1) # define which axis we want to find in World Space

axis_vector = z_axis * world_matrix</code></pre>
</div>

<p>To generate a transformation matrix (specifically a rotation matrix) from three known vectors, these vectors must be mutually perpendicular. If the vectors are not strictly perpendicular, the resulting object will have skewed geometry. Assuming we have three mutually perpendicular vectors <b>aim</b>, <b>up</b> and <b>normal</b>,  representing <b>X,Y,Z</b> axes respectively, the following code can be used to build a transformation matrix from these vectors:</p>
    
<div class="code-block">
<pre><button class="copy-btn"><i class="fas fa-copy"></i></button><code class="language-python">import maya.api.OpenMaya as OpenMaya
# ...
# we have 3 vectors - aim, up and normal, all in world space and mutually perpendicular
matrix = OpenMaya.MMatrix((
    (aim.x, aim.y, aim.z, 0),
    (up.x, up.y, up.z, 0),
    (normal.x, normal.y, normal.z, 0),
    (0, 0, 0, 1.0)
))

transformation_matrix = om.MTransformationMatrix(matrix)</code></pre>
</div>

<p>You might be wondering why it's necessary to build a transformation matrix from these specific vectors. Imagine you need to position an object on another object's face, not just moving it but also rotating it appropriately, similar to how a scattering tool places stones on a hill's landscape. For this, you would select a random (or based on a Perlin noise mask) face's center on the landscape mesh, determine the direction of the face's normal (up vector), locate the center of its edge (aim vector), and calculate the cross product of these two vectors (normal vector). Constructing a transformation matrix from these three vectors enables precise placement and rotation of the object on the face's surface.</p>

<img src="{{ '/assets/img/blog/deepdive_matrix/objPlacement.png' | absolute_url }}" class="img-fluid" alt="...">

<p>I like <a target="_blank" class="text-info" href="https://github.com/volodinroman/maya-matrix-math/blob/main/src/align_obj_to_face.py">this example</a> because it functions similarly to the <b>Rivet</b> constraint in Maya. The concept involves positioning an object onto a face of another object and orienting it in such a way that it aligns with the face's direction. The key aspect of this example is the need to construct a transformation matrix entirely from scratch, using three vectors as inputs. These vectors represent the coordinate system axes of the transformation matrix, and we must read the face data to obtain them. Feel free to use and modify this script as part of a larger scattering tool.</p>

<h3>Maya and Matrices</h3>

<p>In Maya, there are numerous methods to manipulate matrices. Although a certain degree of programming and mathematical proficiency is required to work with matrices directly, Maya offers various options for programmers to utilize matrices in tools for artists.</p>

<p>One of the ways to play around with matrices is to use <b>Node Editor</b>. Maya Node Editor provides a fast method for prototyping logic. However, its nodes can be non-intuitive, requiring time to find the correct nodes for tasks such as creating a point or multiplying it by a vector or a matrix. Once you become familiar with nodes necessary for matrix and vector mathematics, you will find it straightforward to prototype your logic. All <b>Transform</b> nodes in Maya provide us with all necessary matrix data (<b>Matrix</b>, <b>Parent Matrix</b>, <b>World Matrix</b>, <b>Inverse Matrix</b>, <b>Translate Rotate Scale</b> etc.) that we can connect to other nodes to see the immediate effect.</p> 

<div class="alert alert-secondary" role="alert">
  <p><b>Do you know</b> that Transform nodes in Maya have a "Rotate order" option? The <b>rotation order</b> in Maya determines the order of rotation matrices that are multiplied to produce the final rotation matrix for an object. The default order is XYZ. Rotation orders are hierarchies written backwards, eg. xyz is Rz * Ry * Rx. Changing the rotation order can affect the final rotation of an object. The right rotation order can help us avoid Gimbal Lock or unexpected character rig deformation.</p>
</div>

<p>In addition to nodes, Maya offers API to perform matrix and vector operations and simplify object transformations. You can use the maya.cmds module or access the Maya API via C++ or Python. In my experience, the best way to work with transformations is using <b>Maya Python API (OpenMaya)</b>, which offers a vast array of commands and classes, making it both powerful and easy to use, without having to navigate the complexities of C++. 
</p>

<p>OpenMaya provides several ways to manipulate matrices. Depending on the use case, we may work with matrices differently; for instance, we use a specific approach for simple commands versus deformer or node plugins. However, in most cases, when we want to run a script once to achieve a particular effect, we can use several OpenMaya classes to work with matrices and transformations.</p>

<p>Let's explore some classes that are frequently used for working with matrices and transformations.</p>

<ul>
  <li><b>MPoint</b> represents a 3D point in space</li>
  <li><b>MVector</b> represents a vector in 3D space</li>
  <li><b>MSelectionList</b> is a container class that allows us to store objects. We can add objects to the Selection List by name and request object's DagPath</li>
  <li><b>MDagPath</b> represents a path to a particular object in the DAG (Directed Acyclic Graph) hierarchy of Maya (objects that we see in Maya scene). Many OpenMaya classes work with MDagPaths instead of objects names.</li>
  <li><b>MMatrix</b> is a low-level representation of matrices used for calculations.</li>
  <li><b>MTransformationMatrix</b> is a high-level representation of matrices that offers a useful set of methods to get or set rotation, translation, scale, and pivot values. It can be easily converted to an MMatrix (and vice versa).</li>
  <li><b>MFnTransform</b> is a class that provides access to transform nodes in Maya. It allows us to directly modify the transformations of objects. MFnTransform only works with MTransformationMatrix.</li>
</ul>

<p>For example, here's how to <b>obtain and update</b> object matrices:</p>

<div class="code-block">
  <pre><button class="copy-btn"><i class="fas fa-copy"></i></button><code class="language-python">import maya.api.OpenMaya as OpenMaya

selection_list = OpenMaya.MSelectionList()
selection_list.add("pCube1")
dag_path = selection_list.getDagPath(0) 
world_matrix = dag_path.inclusiveMatrix()

# ... some calculations with world_matrix

# convert world_matrix into MTransformationMatrix
transform_matrix = OpenMaya.MTransformationMatrix(world_matrix)
transform_fn = OpenMaya.MFnTransform(dag_path) # get access to Transform node of pCube1
transform_fn.setTransformation(transform_matrix) # apply the transformation matrix to pCube1 transform node</code></pre>
  </div>

<p>What if we want to <b>align objects</b> in terms of position and orientation, meaning moving one object to the coordinates of another and rotating them to match axes? To achieve this, we can apply the world matrix of one object to another. Ultimately, both objects will share the same position, rotation, and scale.</p>

<div class="code-block">
  <pre><button class="copy-btn"><i class="fas fa-copy"></i></button><code class="language-python">import maya.api.OpenMaya as OpenMaya

# find Cube world matrix
world_matrix = dag_path_cube.inclusiveMatrix() # get World Matrix of the 1st object. Returns MMatrix
transformation_matrix = OpenMaya.MTransformationMatrix(world_matrix) # convert MMatrix into MTransformationMatrix

# set this matrix to Cone
fn_transform = OpenMaya.MFnTransform(dag_path_cone) # wrap the 2nd object with MFnTransform class
fn_transform.setTransformation(world_matrix) # MFnTransform class allows us apply transformation matrix to an object</code></pre>
  </div>

<p>Here are a few more examples of how you can work with matrices in Maya:</p>

<ul>
  <li>Move an object along a local axis of another object (<a target="_blank" class="text-info" href="https://github.com/volodinroman/maya-matrix-math/blob/main/src/move_object_along_vector.py">code</a>)</li>
  <li>Rotate an object around a local axis of another object (<a target="_blank" class="text-info" href="https://github.com/volodinroman/maya-matrix-math/blob/main/src/rotate_obj_around_another_obj.py">code</a>)</li>
  <li>Rotate an object around a random vector (<a target="_blank" class="text-info" href="https://github.com/volodinroman/maya-matrix-math/blob/main/src/rotate_obj_around_random_vector.py">code</a>)</li>
  <li>Move an object up and undo it (<a target="_blank" class="text-info" href="https://github.com/volodinroman/maya-matrix-math/blob/main/src/move_object_up_and_undo.py">code</a>)</li>
  <li>Get world coordinates of an object's vertices (<a target="_blank" class="text-info" href="https://github.com/volodinroman/maya-matrix-math/blob/main/src/get_point_world_position.py">code</a>)</li>
  <li>Extract an axis vector from an object's world matrix (<a target="_blank" class="text-info" href="https://github.com/volodinroman/maya-matrix-math/blob/main/src/extract_axis_vec_from_matrix.py">code</a>)</li>
</ul>

<h3>Conclusion</h3>

<p>Why did I write this article? Firstly, recalling the extensive time I spent learning matrices the hard way, I now aim to share my knowledge in a simplified, user-friendly manner. Secondly, I intend to use this article and its code samples as personal references. And thirdly, why not? :D I hope this has provided new insights or, if you spot a mistake, you know where to <a target="_blank" class="text-info" href="https://www.linkedin.com/in/romanvolodin/">find</a> me.</p>

</div>
</section>



