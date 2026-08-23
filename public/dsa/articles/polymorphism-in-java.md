# Polymorphism in Java

> **Slug:** `polymorphism-in-java`  
> **Published:** 2026-04-17T07:15:30.856Z  
> **Updated:** 2026-04-17T07:15:30.860Z  
> **Keywords:** Polymorphism  
> **Cover Image:** ![Polymorphism in Java](https://cdn.codehelp.in/media/articles/1776366394815-b365f056-WhatsApp_Image_2026-03-16_at_16.59.49__1_.jpeg)

**Description:** Learn polymorphism in Java with clear explanations of method overloading and method overriding, compile-time vs run-time polymorphism.

---

## Polymorphism in Java

- Polymorphism is one of the core concepts of Object-Oriented Programming.
- The word Polymorphism comes from Greek, meaning "many forms". In simple terms, it means that one thing can behave in different ways depending on the situation.
- In Java, polymorphism allows a single method, object, or interface to behave differently based on the context in which it is used. This makes code more flexible, reusable, and easier to maintain.

## Types of Polymorphism in Java

**Java supports two types of polymorphism.**

- The first is Compile-time Polymorphism, also called **Static Polymorphism**.
- The second is Run-time Polymorphism, also called **Dynamic Polymorphism**.

## Compile-time Polymorphism (Static Polymorphism)

Compile-time polymorphism is the type of polymorphism that is resolved by the Java compiler during compilation itself, before the program runs. In Java, this is achieved through Method Overloading.

## Method Overloading

Method overloading means defining multiple methods with the same name in the same class, but with different parameters. The difference can be in the number of parameters, the type of parameters, or both. Java decides which method to call based on the arguments you pass at the time of the call.

Output:

Here, all three methods have the same name `display`, but Java picks the correct one based on the type of argument passed. This decision happens at compile time, which is why it is called compile-time polymorphism.

## Run-time Polymorphism (Dynamic Polymorphism)

Run-time polymorphism is the type of polymorphism that is resolved during the execution of the program, not at compile time. In Java, this is achieved through Method Overriding combined with Inheritance. This is where the real power of polymorphism is seen in Java.

## Method Overriding

Method overriding means that a child class defines a method with the same name and same parameters as a method in the parent class. When the method is called, Java decides at runtime which version to execute based on the actual object, not the reference type.

Output:

Here, `a` is declared as type `Animal`, but at runtime it holds a `Dog` object first and then a `Cat` object. Java looks at the actual object at runtime and calls the correct overridden method. This is why it is called run-time polymorphism.

## Overloading vs Overriding

These two are very different concepts and it is important to understand the difference clearly.

- **Method Overloading** happens within the same class, uses the same method name but different parameters, and is resolved at compile time.
- **Method Overriding** happens between a parent class and a child class, uses the same method name and same parameters, and is resolved at runtime.
- **Overloading** is an example of **compile-time **polymorphism while **overriding **is an example of **run-time** polymorphism.

## The Override Annotation

In Java, when you override a method in a child class, it is a good practice to write `@Override` above the method. This tells the Java compiler that you are intentionally overriding a parent class method. If you make a mistake in the method name or parameters, the compiler will immediately give you an error. This annotation does not change the behavior of the program but helps avoid bugs.

## Abstract Classes and Abstract Methods

An abstract class in Java is a class that cannot be instantiated directly, meaning you cannot create an object of an abstract class. It is designed to be used only as a parent class. An abstract method is a method that has no body, meaning it has no implementation in the parent class. Any child class that extends an abstract class must provide the implementation for all abstract methods.

Output:

Here, `Shape` is an abstract class with an abstract method `draw()`. Both `Circle` and `Rectangle` provide their own implementation of `draw()`. Java decides at runtime which version to call based on the actual object.

## Real-World Analogy

- Think of a person who is an Employee. That same person can also be a Manager, a Developer, or a Designer. Depending on what role they are playing, their work behavior changes.
- But they are still referred to as an Employee. This is exactly what polymorphism does in Java.
- The reference type is the general category (Employee), but the actual behavior at runtime depends on the specific object (Manager, Developer, or Designer).

## Advantages of Polymorphism

- Polymorphism improves code reusability because the same method name can work for different types.
- It increases flexibility because new child classes can be added without changing existing code.
- It reduces redundancy by avoiding the need to write separate logic for each type.
- It also makes the code cleaner and easier to maintain and extend over time.

## Points to Remember

- Polymorphism means "many forms" and allows one interface to be used for different types of actions.
- Java supports two types of polymorphism, which are compile-time polymorphism through method overloading and run-time polymorphism through method overriding.
- All non-static, non-final, and non-private methods in Java are virtual by default, which means run-time polymorphism works automatically through method overriding.
- The `Override` annotation should always be used when overriding methods to avoid mistakes. Abstract classes use the `abstract` keyword and cannot be instantiated directly.
- Any class that extends an abstract class must implement all its abstract methods.



---
*Extracted from CodeHelp (https://www.codehelp.in/articles/polymorphism-in-java)*
