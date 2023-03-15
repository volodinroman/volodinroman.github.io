---
layout: post
title:  "Matrices in Maya"
date:   2023-02-08 21:12:00 -0700
categories: math
tags: [OpenMaya API, Maya, Math, Matrices, Python]
---


<p>Maya is a powerful tool that provides artists and technical specialists with a vast array of capabilities. One of its greatest strengths lies in the Maya API, which allows for the development of custom tools and plugins to enhance the software's functionality. However, even with access to the API, many developers still struggle with the concept of matrices. While they are a fundamental aspect of 3D graphics, matrices can be complex and difficult to grasp for those without a strong math background. Yet, understanding matrices is essential for creating powerful tools and plugins that can truly take Maya to the next level.</p>

<p>
I've seen many resources and tutorials that focus heavily on the mathematical aspects of matrices. In this article, I aim to take a different approach by explaining how matrices can be used to achieve specific results in Maya without getting bogged down in complex equations. By understanding the practical applications of matrices, you'll be able to apply this knowledge to other software programs as well. It's assumed that you have a basic understanding of Python, as well as experience with object-oriented programming and the Maya Python API. 
</p>

<a target = "_blank" href="https://github.com/volodinroman/matrices-in-maya">
  <button type="button" class="btn btn-dark my-2">GitHub: Matrices in Maya</button>
</a>

<h2 class="py-4">What is a transformation matrix</h2>

<p>
A transformation matrix is used to represent an object's <b>position</b>, <b>rotation</b>, and <b>scale</b> in space because it provides a compact and efficient way of encoding these transformations into a single matrix. When we <b>multiply matrices</b>, we combine transformations into a final matrix. The order of multiplication is crucial factor in determining the resulting transformation. Just imagine, if you rotate an object several times around a random axis in Maya viewport and then repeat the same rotations but in a different order will produce different results. At the end, we apply the resulting matrix to an object (it can also be a point or a vector).
</p>

<p>A transformation matrix is composed of 16 floating-point numbers. Each number represents a different aspect of the transformation being applied. There are a lot of articles explaining what each number means and how to get/set, for example, rotations values from the matrix. But, if we know how to use Maya Python API (or any other API), we can easily extract rotation values from the matrix with just one command.</p>

<p>An <b>Identity</b> matrix represents zero transformations. We typically do not apply it to an object, but it can serve as a starting point where we can set only rotation or translation values. For instance, if we have specific coordinates and wish to move our object to that position while preserving its rotation and scale, we create an Identity matrix, set the translation (now our identity matrix becomes a translation matrix), and multiply the object matrix by the translation matrix.</p>

<div class="alert alert-secondary fw-light" role="alert">
  <p>Translation, rotation, and scaling matrices must be multiplied in the order <b>Scale * Rotate * Translate</b>. This order ensures predictable object translations and helps prevent any unwanted deformations (unless you intentionally want to achieve a different result). Thus, if we first rotate the object and then scale, we can accidentially squash it. It's funny, but pointless.</p>
</div>

<p>If we want to reverse the transformation of our objects, we can take the matrix we used to transform our object and <b>invert</b> it. Then, we multiply our object's matrix by the inverted matrix. Inverse matrices are also helpful for converting between different coordinate spaces in Maya, which we will discuss later.</p>

<p>Matrices can be modified and multiplied in various ways to achieve a range of effects. For instance, we can rotate an object around a particular point or axis in space, and position it on the surface of another object.</p>

<!-- <p>
Once we have found a transformation matrix, it can be broken down into rotation, translation, and scale values. However, in most cases, we use the entire matrix for our calculations. When we apply a matrix to an object, we modify its transformation values. <b>Keep in mind, matrix and vector mathematics often go together.</b>  We can create transformation matrices from scratch in different ways. If we know specific coordinates, we can generate a matrix that only moves the object to that coordinate. If we know the rotation values, we can create a matrix that only rotates the object but keeps it in the same place. We can rotate an object around a specific point in space or axis, and even place it on the surface of another object. We can combine rotation, translation, and scale matrices by multiplying them. This way, we can achieve many different effects and transform objects in different ways. <b>OpenMaya API makes working with matrices simple and efficient by providing all the necessary commands and classes.</b>
</p> -->



<!-- <p>
We can <b>inverse a matrix</b> to undo or reverse the transformations of our object. For example, if we used some matrix to rotate our object, we can revert this action by multiplying a matrix of our object by the inversed matrix. Inversed matrix can also be used to <b>convert between different coordinate spaces in Maya</b> (I'll describe them below). For example, to get a world matrix of our object that is a child of another object, we multiply the object's local matrix by the parent's world matrix. Conversely, if we want to get the local position of an object that is a child of another object, we can multiply the object's world matrix by the parent's inverse world matrix, which gives us the object's local matrix.
</p>  -->



<ul>
  <!-- <li>An "<b>Identity</b>" matrix is a matrix that holds <b>zero transformations</b>.</li> -->
  <!-- <li>Changing the order of matrices during multiplication can result in a different effect, because <b>matrices are not commutative</b>. This means that M1 * M2 is not the same as M2 * M1.</li> -->
  <!-- <li>Translation, rotation, and scaling matrices must be multiplied in the order <b>Scale * Rotate * Translate</b>. This order ensures predictable object translations and helps prevent any unwanted deformations (unless you intentionally want to achieve a different result). Thus, if we first rotate the object and then scale, we can accidentially squash it. It's funny, but pointless.</li> -->
  <!-- <li>The <b>rotation order</b> in Maya determines the order of rotation matrices that are multiplied to produce the final rotation matrix for an object. The default order is XYZ. Rotation orders are hierarchys written backwards, eg. xyz is Rz * Ry * Rx. Changing the rotation order can affect the final rotation of an object. The right rotation order can help us avoid Gimbal Lock, thus animators will see clearly represented animation curves.</li> -->
</ul>


<p>Let's check how we can get a world matrix of an object in Maya.</p>

<pre>
<code class="language-python">"""
Get an object world matrix
"""
# using OpenMaya
import maya.api.OpenMaya as OpenMaya
sel_list = om.MSelectionList() 
sel_list.add("pCube1")
dagPath_Cube = sel_list.getDagPath(0) # get Cube dag path
world_matrix = dagPath_Cube.inclusiveMatrix() # returns world matrix of a cube as MMatrix object

# using maya.cmds
import maya.cmds as cmds
world_matrix = cmds.xform('pCube1', q=True, worldSpace=True, matrix=True)

# using a transform node attribute "worldMatrix"
import maya.cmds as cmds
import maya.api.OpenMaya as om
world_matrix = cmds.getAttr("pCube1.worldMatrix")
world_matrix = om.MMatrix(((*world_matrix[0:4]),(*world_matrix[4:8]),(*world_matrix[8:12]),(*world_matrix[12:16]))) # wrap into MMatrix

# Output (this is just an example)
'''
( 0.953066,  -0.0453,  -0.2993,  0), 
( -0.15506,  0.77621,  -0.6111,  0), 
( 0.260041,  0.62884,  0.73276,  0), 
( -1.30316,  4.78874,  1.10175,  1)
'''</code>
</pre>


<h2 class="py-4">Object, Local and World Spaces</h2>

<img src="{{ '/assets/img/blog/matrices_in_maya/spaces.jpg' | absolute_url }}" class="img-fluid py-4" alt="...">

<p>In Maya, <b>World</b>, <b>Local</b>, and <b>Object</b> spaces are three different coordinate systems that make it possible to visualize and manipulate objects in the Viewport.</p>

<p><b>World</b> and <b>Local</b> spaces are used to represent the position, orientation, and scale of an individual object. We can say that a transformation matrix is a coordinate system (and vice versa). When we apply a matrix to an object, we modify object's position and orientation, but it doesn't actually move the object's vertices. Instead, it modifies a coordinate system of the object and Maya Viewport just redraws it in its new location. Magic!</p>


<p><b>World space</b> is the global position of an object in the Maya scene, where the origin is located at the center of the grid. The world matrix represents the global position of the object.</p>

<p><b>Local space</b> is a bit more complex concept in Maya. Every object in the Viewport can be selected and manipulated individually thanks to its parent - a <b>transform node</b>. This node provides the object with its own coordinate system, known as the Local space. <b>Moving the object means moving its coordinate system</b>, while the mesh vertices remains unchanged in their space. If the object has no parent, its Local and World spaces are equivalent. Objects can be placed within other groups (transform nodes) in Maya, creating a hierarchy of transformations where a child group inherits its parent's transformations while also having its own transformations. This hierarchical structure is what makes it possible to manipulate objects in Maya Viewport.</p>

<p><b>Object space</b> is a coordinate system that exists within a polygonal mesh. Each vertex of the mesh resides in the Object space. If the mesh (its transform node) is moved, its vertices' coordinates remain unchanged, as the Object space follows the Local space. This means that, from Maya perspective, the vertices stay in the same positions. However, if an individual vertex is moved, it will have a new coordinate, and the mesh is considered as deformed. The Object space origin is initially located at the center of the mesh.</p>

<p><b>Pivot</b> is a key aspect in object transformations in Maya. Every object in the Viewport has its own <b>Pivot</b>, which serves as a reference point for operations like moving, rotating or scaling. When we perform a transformation on an object, it takes place around the object's pivot.</p>


<div class="alert alert-secondary fw-light" role="alert">
  <p><b>Fact 1.</b> if we apply skinning to our object and animate it, each vertex of the mesh will follow a corresponding bone. In other words, we take a transformation matrix of a bone and apply it to each vertex (preserving the offset of the vertex from the bone origin). This is why animation can be one of the performance bottlenecks, as it's CPU intensive and has a huge impact on FPS.</p>
</div>

<div class="alert alert-secondary fw-light" role="alert">
  <p><b>Fact 2.</b> When querying vertex position or normal vector, OpenMaya returns the coordinates in <b>object space</b> by default. We can obtain the global coordinate of a vertex (or any other component) by multiplying its local coordinate by the <b>object's world matrix</b>. The <b>transform node</b> makes it simple to retrieve the world matrix for an object.</p>
</div>

<p>
Here is how we can get an object's point position in Object Space and convert it into a World Space coordinate:
</p>

<pre>
<code class="language-python">import maya.cmds as cmds
import maya.api.OpenMaya as om

cube = cmds.polyCube()[0]
cmds.move(2,3,4)
cmds.rotate(13,16,20)

sel_list = om.MSelectionList()
sel_list.add(cube)
dag_path = sel_list.getDagPath(0)
world_matrix = dag_path.inclusiveMatrix() # world matrix
iter = om.MItMeshVertex(dag_path) # iterates over the object's vertices

while not iter.isDone():
    
    pos = iter.position() # position in Object Space
    world_pos = pos * world_matrix # world position
    print(pos, world_pos)
    
    iter.next()
"""
Result:
(-0.5, -0.5, 0.5, 1) (1.85051, 2.30744, 4.49801, 1)
(0.5, -0.5, 0.5, 1) (2.7538, 2.63621, 4.22238, 1)
(-0.5, 0.5, 0.5, 1) (1.57552, 3.24426, 4.71425, 1)
(0.5, 0.5, 0.5, 1) (2.47881, 3.57303, 4.43861, 1)
(-0.5, 0.5, -0.5, 1) (1.2462, 3.36379, 3.77762, 1)
(0.5, 0.5, -0.5, 1) (2.14949, 3.69256, 3.50199, 1)
(-0.5, -0.5, -0.5, 1) (1.52119, 2.42697, 3.56139, 1)
(0.5, -0.5, -0.5, 1) (2.42448, 2.75574, 3.28575, 1)
"""</code>
</pre>


<h2 class="py-4">What about vectors?</h2>

<p>
Computer graphics heavily rely on vector math. Vectors serve the fundamental purpose of representing direction. A transformation matrix, being a 3D coordinate system, stores information about rotation. It is possible to obtain the individual axes from the matrix. Conversely, if the directions of all three axes (represented by three perpendicular vectors) are known, a transformation matrix can be constructed from them.
</p>

<div class="alert alert-secondary fw-light" role="alert">
  <p>If Magnitude, Normalization, Dot Product and Cross Product words mean nothing to you - google it right away! Vector math is easy to learn :)</p>
</div>


<p>As an illustration, to find the Z-axis world direction of an object as an MVector, we multiply a vector (0, 0, 1) by the object's world matrix.</p>

<pre>
<code class="language-python">import maya.api.OpenMaya as OpenMaya
# ...
world_matrix = dag_path.inclusiveMatrix() # get world matrix from an object DagPath
axis = OpenMaya.MVector(0,0,1) # define which axis we want to find in World Space

axis_vector = axis * world_matrix</code>
</pre>

<p>To generate a transformation matrix (rotation matrix only) from three known vectors, it is necessary that the vectors be mutually perpendicular.  It is important to note that if the vectors are not strictly perpendicular, the result will be an object with a skewed geometry.</p>

<div class="alert alert-secondary fw-light" role="alert">
  <p>In the <b>"Examples"</b> section, you will find various applications of matrices in Maya. One of the example demonstrates how I calculated a transformation matrix using three vectors to position a locator on a face and orient it correctly. This example could serve as a starting point for developing a scattering tool.</p>
</div>

<pre>
<code class="language-python">import maya.api.OpenMaya as OpenMaya
# ...
# we have 3 vectors - aim, up and normal, all in world space and mutually perpendicular
matrix = OpenMaya.MMatrix((
    (aim.x, aim.y, aim.z, 0),
    (up.x, up.y, up.z, 0),
    (normal.x, normal.y, normal.z, 0),
    (0, 0, 0, 1.0)
))

transformation_matrix = om.MTransformationMatrix(matrix)</code>
</pre>

<h2 class="py-4">Maya and Matrices</h2>

<p>In Maya, there are numerous methods to manipulate matrices. Although a certain degree of programming and mathematical proficiency is required to work with matrices directly, Maya offers various options for programmers to utilize matrices in tools for artists.</p>





<p>Maya NodeEditor provides a fast method for prototyping logic. However, its nodes can be non-intuitive, requiring time to locate the correct nodes for tasks such as creating a point or multiplying it by a vector or a matrix. Once you become familiar with the limited number of nodes necessary for matrix and vector mathematics, you will find it straightforward to prototype your logic.</p> 

<p>A Transform node in Maya represents the transformation of an object, and it has various outputs that can be utilized in the NodeEditor to prototype a tool logic. The outputs that you may need include:</p>

<ul>
  <li><b>Translation</b>, <b>Rotation</b>, <b>Scale</b></li>
  <li><b>matrix</b>: The matrix that represents the transformation of the node in local space.</li>
  <li><b>inverseMatrix</b>: The matrix that is the inverse of the "matrix" attribute.</li>
  <li><b>worldMatrix</b>: The matrix that represents the transformation of the node in world space.</li>
  <li><b>worldInverseMatrix</b>: The matrix that is the inverse of the "worldMatrix" attribute.</li>
  <li><b>parentMatrix</b>: The matrix that represents the node's parent transformation in world space.</li>
  <li><b>parentMatrixInverse</b>: The matrix that is the inverse of the "parentMatrix".</li>
  

</ul>

<img src="{{ '/assets/img/blog/matrices_in_maya/nodeeditor.jpg' | absolute_url }}" class="img-fluid py-4" alt="...">

<div class="alert alert-secondary fw-light" role="alert">
  <p><b>Do you know that Transform nodes in Maya have a "Rotate order" option?</b> The <b>rotation order</b> in Maya determines the order of rotation matrices that are multiplied to produce the final rotation matrix for an object. The default order is XYZ. Rotation orders are hierarchies written backwards, eg. xyz is Rz * Ry * Rx. Changing the rotation order can affect the final rotation of an object. The right rotation order can help us avoid Gimbal Lock, thus animators will see clearly represented animation curves.</p>
</div>

<p>
In addition to nodes, Maya offers API to perform matrix and vector operations and simplify object transformations. You can use the maya.cmds module or access the Maya API via C++ or Python. In my experience, the best way to work with transformations is using <b>Maya Python API (OpenMaya)</b>, which offers a vast array of commands and classes, making it both powerful and easy to use, without having to navigate the complexities of C++. 
</p>

<p>OpenMaya provides several ways to manipulate matrices. Depending on the use case, we may work with matrices differently; for instance, we use a specific approach for simple commands versus deformer or node plugins. However, in most cases, when we want to run a script once to achieve a particular effect, we can use several OpenMaya classes to work with matrices and transformations.</p>

<p>Let's explore the classes that are frequently used for working with matrices and transformations.</p>

<ul>
  <li><b>MPoint</b> represents a 3D point in space</li>
  <li><b>MVector</b> represents a vector in 3D space</li>
  <li><b>MSelectionList</b> is a container class that allows us to store objects. We can add objects to the Selection List by name and request object's DagPath</li>
  <li><b>MDagPath</b> represents a path to a particular object in the DAG (Directed Acyclic Graph) hierarchy of Maya (objects that we see in Maya scene). Many OpenMaya classes work with MDagPaths instead of objects names.</li>
  <li><b>MMatrix</b> is a low-level representation of matrices used for calculations.</li>
  <li><b>MTransformationMatrix</b> is a high-level representation of matrices that offers a useful set of methods to get or set rotation, translation, scale, and pivot values. It can be easily converted to an MMatrix (and vice versa).</li>
  <li><b>MFnTransform</b> is a class that provides access to transform nodes in Maya. It allows us to directly modify the transformations of objects. MFnTransform only works with MTransformationMatrix.</li>
</ul>

<p>Here is an example of using OpenMaya that demonstrates how to obtain and update object matrices:</p>

<pre>
<code class="language-python">import maya.api.OpenMaya as OpenMaya

selection_list = OpenMaya.MSelectionList()
selection_list.add("pCube1")
dag_path = selection_list.getDagPath(0) 
world_matrix = dag_path.inclusiveMatrix()

# ... some calculations with world_matrix

# convert world_matrix into MTransformationMatrix
transform_matrix = OpenMaya.MTransformationMatrix(world_matrix)
transform_fn = OpenMaya.MFnTransform(dag_path) # get access to Transform node of pCube1
transform_fn.setTransformation(transform_matrix) # apply that transformation matrix to pCube1 transform node</code>
</pre>




<h2 class="py-4">Examples</h2>

<div class="alert alert-secondary fw-light" role="alert">
  <p>In this part I omitted some unnecessary code. Think of it as a pseudocode that demonstrates the logical steps to achieve some specific results. If you don't know how to use Maya Python API, what are iterators and DagPath, I would suggest learning it first. However, on GitHub you will find full versions of the code samples.</p>
</div>

<h5>Match objects</h5>

<p>
We'll start with a simple task. We will take a world matrix of one object and apply it to another object. At the end both objects will have similar positions, rotations and scale. 
</p>

<pre>
<code class="language-python">import maya.api.OpenMaya as OpenMaya

# find Cube world matrix
world_matrix = dag_path_cube.inclusiveMatrix() # get World Matrix of the 1st object. Returns MMatrix
transformation_matrix = OpenMaya.MTransformationMatrix(world_matrix) # convert MMatrix into MTransformationMatrix

# set this matrix to Cone
fn_transform = OpenMaya.MFnTransform(dag_path_cone) # wrap the 2nd object with MFnTransform class
fn_transform.setTransformation(world_matrix) # MFnTransform class allows us apply transformation matrix to an object</code>
</pre>

<h5>Move an object along a local axis of another object</h5>

<p>
We have a <b>Cone</b> object located in space. We will extract the local Y-axis direction from the Cone and use it to move another object (<b>Cube</b>) along that axis. 
</p>

<pre>
<code class="language-python">"""
Get an offset vector that is based on Y axis and an offset distance value
"""
import maya.api.OpenMaya as OpenMaya
# ...

offset_distance = 3 # Distance to move along
vector = OpenMaya.MVector(0,1,0) * cone_matrix # Cone Y vector in world space
vector.normalize() # set its length to 1
offset = vector * offset_distance # we receive an offset vector that stores a direction and the offset distance</code>
</pre>

We have 3 ways to move an object along a vector:

<ul>
  <li>We move the Cube along the Y vector from the Cube's original position and do not touch the Cube's rotation.</li>
  <li>We move the Cube along the Y vector from the Cube's original position and orient it in the same way as the Cone</li>
  <li>We move the Cube along the Y vector from the Cone's original position and orient it in the same way as the Cone.</li>
</ul>

Let's check the third option. All options samples can be found on GitHub.

<pre>
<code class="language-python">""" We move the Cube along the Y vector from the center of the Cone and orient it in the same way as the Cone."""

# We should set Cone scale values back to (1,1,1), otherwise our cube will inherit the scale as well
# We just want it to inherit translation and rotation
matrix = cone_scale_matrix.inverse() * cone_matrix # we zero out Cone scale to (1,1,1)
# We can get a Scale matrix by extracting it from MTransformationMatrix, using ".asScaleMatrix()" method

tMatrix = OpenMaya.MTransformationMatrix(matrix) # create a new transformation matrix
pos = tMatrix.translation(OpenMaya.MSpace.kWorld) # get position values from it (as MPoint)
pos = pos + offset # modifi the position
tMatrix.setTranslation(pos, OpenMaya.MSpace.kWorld) # set the position back to transformation matrix
fnTransform.setTransformation(tMatrix) # apply transformation matrix to the Cube transform</code>
</pre>

<h5 class="py-4">Rotate one object around a local axis of another object</h5>

<p>The idea in this example is to rotate a random object around any of 3 local axes of another object. We will rotate a Cube around a Cone Y axis.</p>

<pre>
<code class="language-python"># we want to rotate this object
mCube = dpCube.inclusiveMatrix() # get world matrix
# around this object
mCone = dpCone.inclusiveMatrix() # get world matrix

# rotate by 30 degrees
degree = 30
angle = om.MAngle(degree, om.MAngle.kDegrees)
rad = angle.asRadians() # convert degrees to radians
rotation = om.MEulerRotation(0,rad,0, om.MEulerRotation.kXYZ) # create a rotation object
mRotation = rotation.asMatrix() # convert EulerRotation into MMatrix

# next we place Cube into a local space of the Cone, 
# apply rotation matrix, and push it back to world space
matrix =  mCube * mCone.inverse() * mRotation * mCone 

# convert MMatrix into MTransformationMatrix
tmCube = om.MTransformationMatrix(matrix)  

# apply matrix to cube
fnTrCube = om.MFnTransform(dpCube)
fnTrCube.setTransformation(tmCube)</code>
</pre>


<h5 class="py-4">Place object on a face of another object</h5>

<p>I like this example because it functions similarly to the <b>Rivet</b> constraint. The concept involves positioning an object onto a face of another object and orienting it in such a way that it aligns with the face's direction.</p>

<p>The key aspect of this example is the need to construct a transformation matrix entirely from scratch, using three vectors as inputs. These vectors represent the coordinate system axes of the transformation matrix, and we must read the face data to obtain them. It is essential to note, as mentioned earlier, that all three vectors must be mutually perpendicular, or else our object placed on the face will become skewed.</p>

<p>The first vector corresponds to the face's normal. The second vector denotes the vector from the face's center to one of its edges' centers. Lastly, the third vector is the result of a cross-product operation between these two vectors.</p>

<img src="{{ '/assets/img/blog/matrices_in_maya/facealign.jpg' | absolute_url }}" class="img-fluid py-4" alt="...">

<p>Suppose that we want to align a locator onto one of the Cube's faces. Here is a sequence of steps that we can follow to ensure that our script operates as intended:</p>

<pre>
<code class="language-python">face_id = "4" # face index

# create Faces iterator and set index "face_idx" so we work only with that face
face_iter = OpenMaya.MItMeshPolygon(dag_path)
face_iter.setIndex(face_idx)

# find face normal vector in World Space
vec_normal = face_iter.getNormal()
vec_normal = vec_normal * world_matrix # local to world conversion
vec_normal.normalize() # set length to 1

# find the second vector
face_center = face_iter.center(OpenMaya.MSpace.kWorld) # get face center coordinate as MPoint
points = face_iter.getPoints(OpenMaya.MSpace.kWorld) # get all points of the current face
edge_center = OpenMaya.MPoint(  (points[0].x + points[1].x)/2, 
                                (points[0].y + points[1].y)/2, 
                                (points[0].z + points[1].z)/2)

vec_tangent = OpenMaya.MVector( edge_center.x - face_center.x, 
                                edge_center.y - face_center.y, 
                                edge_center.z - face_center.z)
vec_tangent.normalize()

# find the third vector
vec_up = vec_normal ^ vec_tangent # Cross-product of the two other vectors
vec_up.normalize()

# Construct the final matrix, set face_center in 4th row (which is responsible for position)
output_matrix = OpenMaya.MMatrix((
        (vec_tangent.x, vec_tangent.y, vec_tangent.z, 0),
        (vec_up.x, vec_up.y, vec_up.z, 0),
        (vec_normal.x, vec_normal.y, vec_normal.z, 0),
        (face_center.x, face_center.y, face_center.z, 1.0)
    ))

transform_matrix = OpenMaya.MTransformationMatrix(output_matrix) # convert MMatrix to MTransformationMatrix

locator_transform_fn.setTransformation(transform_matrix) # apply transformation matrix to locator</code>
</pre>