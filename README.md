# Open Image Annonate
OAnnotate is a an open source Image Annotation and re-sizing library. Image Annotation, aka drawing bounding boxes, is a major first step into developing vision processing. This is also the most tedious and most error prone step of the entire deep learning process.  
The goal of this project is to ease the pain for the following steps, 
* Personal ImageNet
  * Collect all images in one place, essentially create a personal image store
  * Draw bounding box(es) and annotate the class for each image in the image
* Save the annotations in the online database
  * Database saves annotations in a neutral format
  * Export(s) in formats for YOLO, PASCAL or TURI
* Format and re-size image(s) 
  * Manage file exports in a single format
  * Manage image re-size(s) in a single format 
* Download ImageSet
  * Download re-formatted ImageSet, which includes
   * images
   * annotations
 
 The dataset would be ready for training immediately. 
 ![Machine Learning Flow](https://github.com/neosinha/oannonate/blob/master/docs/ml-flow.png)


