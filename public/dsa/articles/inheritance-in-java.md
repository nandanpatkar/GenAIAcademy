# Inheritance in Java

> **Slug:** `inheritance-in-java`  
> **Published:** 2026-04-17T07:13:50.048Z  
> **Updated:** 2026-04-17T07:13:50.053Z  
> **Keywords:** Inheritance in Java, Types of Inheritance, Implementation  
> **Cover Image:** ![Inheritance in Java](https://cdn.codehelp.in/media/articles/1776364702040-03ecfc34-WhatsApp_Image_2026-03-16_at_16.59.48.jpeg)

**Description:** Learn Java inheritance with clear examples, types (single, multilevel, hierarchical), access modifiers, constructors, and real-world use cases.

---

## Inheritance in Java

- Inheritance is one of the **core** principles of **Object-Oriented Programming** that allows a **class** to **reuse** properties and behaviors of another class.
- It helps in building a relationship between **classes** and promotes **code** **reusability**.
- In simple terms,** inheritance allows you to create a new class based on an existing one**, instead of writing everything from scratch.

## What is Inheritance?

- Inheritance is a mechanism where one class (called the child class) acquires the properties and methods of another class (called the parent class).
- The class whose features are inherited is called the Parent Class (Superclass), and the class that inherits those features is called the Child Class (Subclass).
- Inheritance represents an is a relationship. 
For example, a Dog is a Animal. This means wherever an Animal is expected, a Dog can be used.



## Types of Inheritance in Java

Java supports several types of inheritance.

**1. ****Single Inheritance**

Single inheritance means one parent class and one child class.

**2. ****Multilevel Inheritance**

In multilevel inheritance, a class inherits from another derived class, forming a chain.



**3. ****Hierarchical Inheritance**

In hierarchical inheritance, multiple child classes inherit from the same parent class.




**Note:** Java does not support multiple inheritance with classes to avoid the Diamond Problem. The Diamond Problem is a conflict that arises when two parent classes have a method with the same name, causing ambiguity for the child class. However, multiple inheritance can be achieved using interfaces.

## Access Specifiers in Inheritance

Access modifiers control how members of a class are accessible in subclasses. 

- `public` means the member is accessible everywhere.
- `protected` means it is accessible within the same package and in subclasses.
- `default` (no modifier) means it is accessible only within the same package and not in subclasses outside the package.
- `private` means it is not accessible directly in subclasses at all.



Choosing the right access modifier is important to control how inherited members are accessed in subclasses and from outside the class.

## The super Keyword

- The `super` keyword is used inside a child class to refer to the parent class.
- It can be used to call the parent class constructor using `super()`, and to call a parent class method using `super.methodName()`.
- This is especially useful when the child class overrides a method but still needs to use the parent version.



## Advantages of Inheritance

- Inheritance provides code reusability, meaning you write the logic once and use it across multiple classes.
- It reduces redundancy by avoiding duplicate code across related classes.
- It supports polymorphism by enabling method overriding in child classes.
- It also promotes better organization by creating a logical and structured class hierarchy.

## Constructors in Inheritance

Constructors are not inherited in Java. However, when a child class object is created, the parent class constructor is automatically called first through an implicit `super()` call, and then the child class constructor executes. Java automatically inserts `super()` as the first line in the child constructor if it is not explicitly written. This ensures that the parent part of the object is properly initialized before the child part.

Output:

This ensures proper initialization of the parent part before the child.

## Example: Inheritance in a Vehicle System



## Real-World Analogy

Now we see the real life example:

- Suppose of a Vehicle as a parent class.
- A Car, Bike, and Truck can all inherit common features like starting or stopping from the Vehicle class.
- Each vehicle can also have its own specific features, such as a Car having a honk method or a Truck having a load capacity.
- This way, common functionality is reused, and unique behavior is added where needed.

## Points to Remember

- The `extends` keyword is used to implement inheritance in Java. Java supports single, multilevel, and hierarchical inheritance through classes.
- Multiple inheritance is not supported with classes due to the Diamond Problem, but it is possible through interfaces.
- Constructors are not inherited, but the parent constructor is always called first through `super()`.
- The `super` keyword is used to access parent class methods and constructors from the child class. A class declared as `final` cannot be inherited by any other class.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/inheritance-in-java)*
