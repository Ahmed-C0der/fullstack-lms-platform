# the Golden rule
buiild the structure and component wihtout styling and connect them , build your logic and contexts then make 
AI put styling by get guidments from design-language-system.md
# structure
inside app directory 
-(pages) =>(Auth),(NotStudent)(AdminOnly), 
-myComponent , 
-context , 
# page
inside (pages) i have 8 
- Home Page ✔
- (Auth pages)
- Courses Catelog ✔
- My enrollment ✔
- Course Detail ✔
- lessons View ✔
- current lesson (coure player page) // present all detail about the Lesson ✔
- Public Certificate Verification Page ✔
- Settings & profile ✔
- Checkout Page (Public)✔
- Student Dashboard
-   (NotStudent)
    - admin / instructor Dashboard to present an over view for important data and links for important pages : course builder or whole analatycs page or his courses like My enrollment
    - Course Builder
    - Instructor Analytics
        - total revenue 
        - all student of all his coure
        - new enrollment
        - Percent of enrollment Completed
        - to do 
        - links to his coures
        - tabel present tob 3 courses 

- (Admin Only)
- User Management to edit users Delet or change role add New User present number of enrollment number of all users
- edit featured courses

# component
## global component
### Nav bar

    logo

    link to courses
    about
    enrollment
    ...
    if (Auth){
        present dashBoard link , profile link notStudent ? presnet admin / instructor Dashboard link : student dashboard link
    }else{
        login , register link
    }

## Home Page
Hero contain link to all courses , view pricing

### logos section
contain all logos for supported company
### featured courses

### testtimonials
use card from shadCn

### CTA

### Footer

# context

## userContext
this have one task is get userData and provide it to whole app
to do that i need -->{
    creatContext
    creatReactcomponnet and make it wrapper for whole app to get user data from any place
    and in the same place type 
```JS
export const useAuth = () => useContext(AuthContext); // instead of in all place import useContext and give it AuthContext as value ofcoure after import it  
```
}
## usercoures

## ....etc