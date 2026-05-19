Received 19 August 2025, accepted 29 September 2025, date of publication 8 October 2025, date of current version 16 October 2025.
_Digital Object Identifier 10.1109/ACCESS.2025._

# Improving Perception of Usability Through User

# Interface Design Patterns to Optimize Information

# Architecture for Cognitive Benefits and User

# Satisfaction in Massive Open Online Courses

## TAHIR FAROOQ^1 , C. M. NADEEM FAISAL 1,2, JAVIER DE ANDRES^3 , ZAFAR SAEED^2 ,

## SAJID ANWER^4 , AND TOQEER MAHMOOD^1

(^1) Department of Computer Science, National Textile University, Faisalabad 37610, Pakistan
(^2) Department of Computer Science, University of Bari, 70121 Bari, Italy
(^3) Department of Accounting, University of Oviedo, 33003 Oviedo, Spain
(^4) Department of Software Engineering, College of Computer Engineering and Sciences, Prince Sattam Bin Abdulaziz University, Al-Kharj 16278, Saudi Arabia
Corresponding authors: Javier de Andres (jdandres@uniovi.es) and C. M. Nadeem Faisal (nadeem.faisal@ntu.edu.pk)
This work involved human subjects or animals in its research. Approval of all ethical and experimental procedures
and protocols was granted by the Institutional Review Board (IRB), National Textile University, Faisalabad,
Pakistan under Approval No. NTU/IRB/2023/89.
**ABSTRACT** This study explores the impact of user interface design patterns on usability, cognitive load,
and user satisfaction for Massive Open Online Courses using small-screen devices. An empirical approach
was adopted, involving 232 university students who voluntarily participated in the experiment. Prototypes of
three well-known Massive Open Online Courses platforms (i.e., Coursera, Udemy, and edX) were developed
to assess how various user interface design patterns influence user experience. The findings revealed that
the aesthetic design of Coursera, including color scheme, content organization, was perceived as the most
visually appealing, while Udemy received higher ratings for its typography, i.e, font size, type, and button
shape. Coursera also outperformed the other platforms in terms of navigation (e.g., tab navigation, hamburger
menu, drop-down, floating action button, listview), customization features (e.g., search filters, font, and
background settings), and feedback mechanisms (e.g., toast messages, error alerts, progress indicators,
confirmation prompts, and system status updates). Overall, participants reported higher satisfaction with
Coursera, and its interface was associated with a lower cognitive load compared to Udemy and edX. These
results underscore the importance of thoughtful user interface design in enhancing usability and reducing
cognitive effort in mobile learning applications.
**INDEX TERMS** Cognitive load, design patterns, information architecture, massive open online courses,
usability, user interfaces, user-satisfaction.
**I. INTRODUCTION**
the significance of eLearning technologies has grown sub-
stantially [1]. Among these technologies, Massive Open
Online Courses (MOOCs) offering platforms have become
one of the most popular trends in online education, helping
students to achieve their intended goals [2], [3]. The global
(^0) The associate editor coordinating the review of this manuscript and
approving it for publication was Olarik Surinta.
adoption of digital education platforms has accelerated the
need to evaluate their User Interface (UI) design for a better
user experience.
User satisfaction and learning outcomes in these platforms
are significantly influenced by UI design quality[1], [4].
Due to poor UI design, MOOCs face significant adoption
challenges due to poor usability and User interface (UI)
design problems[4], [5]. UI design strongly impacts mental
resources load, and poor UI design leads to cognitive
VOLUME 13, 2025
2025 The Authors. This work is licensed under a Creative Commons Attribution 4.0 License.
For more information, see https://creativecommons.org/licenses/by/4.0/ 176259


burden [5], [6], [7]. This overwhelming cognitive burden can
escalate into frustration, irritation, and boredom, ultimately
leading to system abandonment [8]. Furthermore, research
indicates that fewer than 10% of MOOC participants
complete their courses [4], [5].
Previous research has largely concentrated on examining
user experiences through fully functional desktop web
browsers to explore design implications [9]. Website inter-
face on desktop utilizes precise, mouse-driven interactions,
smartphones rely on touch-based interfaces, where the
human finger, being less accurate than a mouse, often
results in increased error rates and reduced interaction
precision [10], [11]. Desktop users typically engage through
indirect manipulation, while mobile users interact via direct
touch, demanding a different approach to interface design[6],
[11].
Design principles from Human Computer Interaction
(HCI), including visibility, affordance, feedback, and con-
sistency, are foundational to effective UI design [2],
[12], [13]. Moreover, the diversity in user needs across
web and mobile platforms introduces added complexity
in UI design [13], [14], [15]. The design of handheld
devices (e.g, smartphones, tablets) has introduced new
UI design patterns, including menu layouts and interac-
tion techniques. The precise use of these UI patterns to
fit for heightened interaction is still challenging for UI
designers. This may be due to the limited screen size,
tiny controls, unregulated navigation, lack of organization,
inappropriate layout, poor responsiveness, and poor legibility
[6], [16].
Usability is one of the key metrics to evaluate UI design and
cognitive load[6], [12],[17]. A well-designed UI enhances
ease of use and overall user experience [18]. Usability
assesses whether the system is efficient, effective, safe,
easy to learn, remember, and use while also ensuring user
satisfaction[19]. A well-designed and aesthetically attractive
interface, characterized by harmonious color schemes, uni-
form layouts, and visually pleasing elements, significantly
influences the user’s perceptions of a system’s usability
and encourages their engagement [18],[20],[21]. More
importantly, for smaller screen controls, such as menu icons,
navigation through menus, and moving across tabs, impacts
usability[7], [22].
Several studies have emphasized that poor usability poses
significant challenges to MOOC adoption[1], [14]. Research
on the usability of MOOCs is growing by focusing on
challenges related to small screens, limited input methods,
and changing user contexts[12],[23]. Therefore, further
studies are required to propose suitable UI design patterns to
minimize the usability issues.
Besides usability, cognitive engagement is another key
metric for evaluating UI design. Cognitive engagement refers
to cognitive benefits, which are essential for assessing the
success of e-learning platforms[15],[24]. Cognitive load
refers to the mental effort required by users to execute
tasks on mobile devices[25], and it is an important factor

```
in determining the user experiences[26]. Suleri et al.[27]
observed that the UI design strategies based on UI patterns
significantly lower the users’ cognitive workload compared
to traditional design strategies.
UI patterns for smaller screens influence cognitive func-
tions, and poor UI design consumes substantial mental
resources and potentially causes cognitive load [6], [7].
On smaller screens, users face challenges during different
tasks such as typing and searching, ultimately affecting
learning performance[6], [12],[17],[22],[28]. Although
some recent investigations have explored the impact of
specific UI design patterns on MOOC usability, most have
focused primarily on navigational elements[14], overlooking
other critical design components that may also significantly
influence user engagement, satisfaction, and overall learning
outcomes.
To overcome cognitive load and usability challenges,
effective UI design strategies are necessary. E-learning
service providers are eager to create effective interface
designs for online education, aiming to enhance student
engagement and their continued use[13].
Despite the growing emphasis on user experience
in mobile-based learning environments, the relationship
between UI design patterns and their impact on usability,
cognitive load, and user satisfaction remains underexplored
in the context of MOOCs. This study aims to investigate
how common UI design patterns influence user interaction
by improving usability and minimizing cognitive burden,
ultimately enhancing user satisfaction. To address this gap,
an empirical research methodology is adopted through
university students as participants. The primary objective is
to examine the effect of UI design patterns on improving
usability and satisfaction in online learning environments by
reducing cognitive load. The findings will be used to provide
practical guidelines for the development community, along
with well-suited design UI patterns and interaction genres for
online learning environments. Accordingly, an experimental
prototype of three well-known MOOC platforms (i.e,
Coursera, edX, and Udemy) will be simulated, and the
participants will be required to interact with the employed
experimental prototypes. Their experiences will be assessed
using well-established tools, such as the CEACAM usability
model[29], the System Usability Scale (SUS)[14], the
cognitive load (NASA Task Load Index (NASA-TLX)), and
user satisfaction.
To accomplish the above-mentioned objectives, the follow-
ing questions are defined.
```
```
A. RESEARCH QUESTIONS
RQ1 : Which specific feature of UI design patterns influ-
ences perceived usability?
RQ2 : Which employed MOOCs (i.e., Coursera, Udemy, and
edX) UI induces the least cognitive load?
RQ3 : Which employed MOOCs (i.e., Coursera, Udemy, and
edX) UI is more satisfying for the user’s needs?
```

The remainder of this paper is organized as follows:
Section II reviews the related work; Section III outlines the
research methodology; SectionIV presents the experimental
analysis and discussion; Section V reports the results;
SectionVI highlights the implications of the findings; and
SectionVII concludes the paper with a summary of key
insights, limitations, and directions for future work.

**II. RELATED WORK**
Digitalization has changed the world. Every age group uses
mobile technology according to their requirements[30].
Smartphones are ubiquitous, efficient, and capable of instant
communication, and create an immersive environment for
knowledge sharing [31]. Online learning has become a
common practice for both students and teachers in acquiring
and sharing knowledge and technological advancements with
increased accessibility. In addition, educational platforms
have adopted MOOCs[32]. MOOCs are innovative eLearn-
ing platforms that deliver educational services on a large
scale, free from location and time limitations[13],[33].
Despite the widespread adoption of MOOCs, enhancing
user experience and fostering continued usage remains
a key focus in MOOC research[13]. MOOC platforms
rely heavily on user interface (UI) design, which plays a
crucial role in shaping learners’ performance and overall
experiences. A well-crafted UI evokes positive emotions,
enhances user satisfaction, and significantly contributes to
improved learning outcomes by creating a seamless and
engaging learning experience.[6], [34],[35],[36],[37],
[38]. The core principles of UI design: visibility, affordance,
feedback, and consistency, are fundamental to human-
computer interaction. Visibility ensures critical functions
are easily seen, enhancing task efficiency. Affordance uses
visual cues to suggest functionality, reducing task time.
Feedback provides immediate system responses, minimizing
user uncertainty. Consistency maintains uniform patterns,
lowering cognitive load and learning effort. These principles
collectively optimize user-system interaction when effec-
tively applied, though their implementation varies across
platforms[2], [12],[13],[39]. In contrast, neglecting the
principles of user interface design often leads to ineffective
user interfaces[9], [40]. Previous research[1], [7], [13],[30],
[41],[42],[43],[44] has emphasized that inadequate usability
and high cognitive load due to poor UI design represent
significant obstacles to MOOC adoption, as suboptimal
designs adversely impact the eLearning experience. Mobile
learning is generally less convenient than desktop learning,
with one of the primary challenges being the limited screen
size and tiny controls[28].
Website interfaces that utilize precise mouse-driven inter-
actions, smartphones rely on touch-based interfaces, where
the human finger is less accurate than a mouse, often results
in increased error rates and reduced interaction precision
[6], [11],[45]. Furthermore, mobile devices must present the
same content in a more compact space, which can further

```
hinder usability and increase cognitive load[46]. Another
critical consideration is the significant variation in user
interaction patterns between large-screen desktop interfaces
and mobile interfaces [11], [46]. While website users
typically engage through indirect manipulation, mobile users
interact via direct touch, demanding a different approach
to interface design. These limitations necessitate the iden-
tification and mitigation of mobile-specific usability issues,
as they directly influence user satisfaction, engagement, and
continued use[37],[47].
Rapid advancements in smartphone user interfaces have
led to new UI design patterns, including menu layouts and
interaction techniques[12],[23]. UI design patterns have
developed into a valuable resource for documenting and
reusing proven solutions. The structure of a design pattern
must include specific parameters to make it useful. The same
design pattern can be represented differently to visualize
more extensive or simplified structures[48]. Researchers
have compiled comprehensive catalogs of UI mobile patterns,
creating a rich repository of implementable examples[49].
An interface that effectively incorporates UI design patterns
enables users to achieve their goals more efficiently compared
to one that lacks such support[27],[50].
A well-crafted navigation can enhance system usability
and positively influence users’ motivational states [51].
Moreover, color not only helps the users during navigational
and functional tasks but also during the whole interaction
time[8]. Various researchers in the elegant literature[52],
[53]discussed the impact of color on usability, emotions,
attitude, and intention to purchase. Furthermore, positioning
buttons and controls in appropriate areas of mobile appli-
cations enables users to access necessary information more
easily and efficiently[54]. In another study, Faisal et al.[5]
emphasized that enhancing cognitive engagement requires
attention to specific design quality factors such as font style
(e.g., sans-serif), font size (14–22 px), appropriate color
combinations (e.g., blue-white, grey-black, blue), layout
structure, spacing, and element grouping based on Gestalt
principles.
In HCI, usability has become an essential part of the
system development process[32]. Usability is an important
part of the user experience[55]. It plays a crucial role in
the effectiveness of mobile learning applications, as well-
designed UI significantly influences the user’s perceptions of
a system’s usability and encourages their engagement[18],
[20],[21]. In another study, Nikou[36] argued that effective
user interface design improves usability and increases user
capacity and knowledge. Smaller screen sizes and use of
UI design patterns majorly influence usability and alter
individuals’ usage behaviour and adaptation[7], [56].
The content on the interface that is poorly organized,
insufficient, or inconsistent in quality leads to significant
usability issues[5]. Unexperienced users face even more
usability issues while interacting with mobile devices, such
as identifying menu icons, navigating through menus, and
moving between tabs[22]. Tiny controls alongside small
```

screens can reduce usability due to ergonomic issues, which
include a crowded interface, unregulated navigation, lack
of organization, inappropriate layout, poor responsiveness,
inadequate legibility, and limited space[6], [16]. Users who
are not experts have usability issues while interacting with
mobile devices, such as identifying menu icons, navigating
through menus, and moving between tabs[22]. Studies
indicate that users, especially older adults, often experience
more challenges when navigating complex mobile interfaces,
which can lead to frustration and decreased satisfaction[14].
Satisfaction is characterized as freedom from discomfort and
positive attitudes toward using the product[57]. Usability
evaluation serves as a crucial method for assessing user
satisfaction. This satisfaction is fundamental to usability, with
Nielsen noting that it is a key factor that can directly influence
usability levels[58].
Besides usability, cognitive engagement is essential in
evaluating the success and intention to use e-learning plat-
forms, as it significantly influences information processing
and continued usage[24]. Cognitive load, by definition, refers
to the mental effort required by users to execute tasks on
mobile devices[25]. The growing use of mobile devices
intensifies competition for users’ attention, making cognitive
workload a key factor in the user experience[15]. The use
of MOOCs on small-screen devices influences cognitive
load, recent findings show that poor interface design further
increases cognitive load and negatively impacts learning
performance [6], [12], [17]. A small screen can make
typing and searching more difficult, increasing cognitive
load and potentially hinder learning performance[22],[28].
For instance, research exploring student interactions with
learning management systems found that intuitive navigation
and clear visual hierarchies correlate strongly with increased
engagement and reduced cognitive load[59]. Navigation
and clear visual hierarchies in learning management systems
strongly correlate with increased engagement and reduced
cognitive load[59]. The NASA Task Load Index (NASA-
TLX) is a commonly utilized tool to evaluate cognitive
load. It measures six factors: mental demand (MD), physical
demand (PD), temporal demand (TD), performance, effort
(PE), and frustration (F) [60]. Ali et al. [61] applied
NASA-TLX to the usability testing of users of different age
groups. Gani et al.[62]argued that the NASA Task Load
Index (NASA TLX) is an effective instrument for collecting
subjective feedback from participants.
User behavior is the most important factor in user-centered
UI design[67]. eLearning service providers are striving to
create inclusive interface designs for online education to
retain students and continue online learning[13]. Utilizing
well-designed eLearning technologies to access educational
content can foster an online learning environment that is
more accessible and engaging[6]. Current mobile UI design
trends emphasize the creation of more intuitive and engaging
user experiences[68]. However, it is worth noting that most
research describes a limited number of designs and provides
minimal information regarding user usability difficulties and

```
the need for more research in capturing and describing mobile
UI design patterns[55]. The following Table1 summarizes
prior studies related to user interface design patterns and
principles, as discussed in previous literature. To summarize,
existing research has shown that usability and cognitive load
are key factors for MOOCs adoption and retention. However,
there is a need to investigate how they impact MOOCs’
learning performance.
To the best of our knowledge, in this respect no experi-
mental research has been performed. In addition, the impact
of UI patterns on usability and cognitive load, and how the
information architecture influences satisfaction, has not been
studied in existing research. To address this research gap,
this study proposes an empirical research-based approach to
determine the relationship between UI design patterns and
their effects on usability, cognitive load, and satisfaction.
```
```
III. METHODOLOGY
This study aims to explore the role of UI design patterns
in improving the perception of usability by minimizing the
cognitive load of MOOCs to achieve overall satisfaction. The
study primarily adopted an empirical approach by collecting
data using a questionnaire survey. The data was collected
from university students who volunteered to participate in
the study. Initially, experimental prototypes were developed
for well-known MOOC platforms(i.e., Coursera, Udemy, and
edX). The developed prototypes use different UI design
patterns based on the standard guidelines and were similar to
the employed MOOCs. The categorization of the employed
UI patterns was primarily based on the industrial standards
and scientific studies, such as hamburger menu, breadcrumb
navigation, and tabbed navigation patterns [49], which
were used to help the users move through, or navigate
back and forth between the different sections. Typography,
color scheme, and background color patterns used for
aesthetics[58],[69]. Search and filter patterns are used for
customized search[49],[58]. The content display card pattern
is used to show the course outlines, progress indicators, and
course details[67],[70]. Cardview patterns are used to adjust
the content according to screen size[71]. Notification and
feedback patterns are used for short pop-up messages that
indicate task completion, errors, or updates[49]. The list
menu pattern is used to vertically display the courses on the
screen[49]. The video player interface pattern is used, which
includes all controls related to videos. Moreover, a major
color scheme is used in Coursera (white, blue, light and dark
grey, orange), Udemy (white, purple, light and dark grey,
blue), and edX(white, greenish black, red, light and dark
grey). The sans-serif font style is used in all three MOOCs
(see Fig.2, Fig.3, Fig.4).
An experimental procedure was designed to conduct a
study to assess the user experiences for these developed
platforms. After developing prototypes, the users were asked
to access these developed platforms. Participants could
register, enroll in courses, and download lecture notes and
videos using the prototypes. Quantitative data was analyzed
```

**TABLE 1.** Design Related Studies.

using SPSS 29.0. Both descriptive and inferential (e.g., paired
t-test) statistical techniques were used to perform the analysis.
Initially, it was important to check the reliability of the
questionnaire; therefore, to assess the reliability and internal
consistency, Cronbach’s Alpha was computed. This study
is centered around three objectives, which are divided into
three studies: study one assessed the impact of UI patterns
on perceived usability, study two explored which employed
MOOC induces the least cognitive load on user experiences,
and the third study examined which employed MOOC was
more satisfying for the participants.

A. PARTICIPANTS AND DATA COLLECTION
This study used a survey-based approach to collect data
from university students. The population consisted of under-
graduate students enrolled in a university. Undergraduate
students from the domain of computer science were selected
as participants in this experiment, comprising 60% males
and 40% females. Before the experiment, all students
were briefed on the tasks they were required to perform.
University students were considered the most suitable sample
for this study due to their frequent use of the eLearning
environment. Before the actual experimentation, required
permissions were applied for and obtained from the IRB
board of concerned departments and institutions. At the
start of the academic session, the prototypes of the selected
MOOCs were introduced to the participants in collaboration
with university management and faculty. Participants were
encouraged to use the learning platform (MOOCs) for
enrollment and to complete course-related activities on their
mobile devices. The relevant and sufficient guidance was
provided to the participants during the various sessions.
Participants were asked to use each prototype for two months,
and at the end of each session, participants were asked to
share their experiences and perceptions of each prototype
by using a survey including questions related to perceived
usability, cognitive load, and satisfaction. A survey scale
was prepared by using Google Forms and integrated within
the experimental prototypes. Table 2 shows the demographic

```
TABLE 2. Sample Data (Participant Details).
```
```
FIGURE 1. Linear process diagram.
```
```
description of participants, and Fig. 1 shows the Linear
Process Diagram.
```
```
IV. EXPERIMENTAL ANALYSIS AND DISCUSSION
Participants were engaged with the prototypes and completed
their tasks, which included registration, enrollment, down-
loading lecture notes and videos, engaging in discussions
with their peers through the conversation portal courses, navi-
gating within the prototypes, and exploring the visual design,
typography, font quality, interaction design, customization,
feedback, and user controls.
```
```
A. UI PATTERNS AND PERCEIVED USABILITY (RQ1)
This study aims to evaluate the influence of UI design
patterns on perceived usability. To assess the perceived
usability of the interface design, the survey scale is taken
primarily from a recent study [29]. The statistical results
showed the significant differences between the prototypes,
providing insight into how the UI design influences perceived
usability. The results offer a comprehensive understanding
of user preferences and the effectiveness of different design
```

**FIGURE 2.** MOOC of Udemy.

```
FIGURE 3. MOOC of Coursera.
```
**FIGURE 4.** MOOC of edX.


**TABLE 3.** Perceived Usability Questionnaire.

**TABLE 4.** Paired t-test analysis of Visual Design/ Aesthetics.

**TABLE 5.** Paired t-test analysis of Visual Design/ Typography.

approaches. Different aspects of usability were considered
during the study experiment, which are discussed in this
section.

1) VISUAL DESIGN
Visual design plays a prominent role by enhancing readability
and recognition, and drawing users’ attention to important
information. Furthermore, key elements such as precise
organization, symmetry, grouping, order, animation, color,
font, and layout create an attractive and visually pleasing
appearance [12], [26],[27],[72]. In this research, visual
design is discussed in two further categories. The reliability
of the questions under visual design was computed, which
was acceptable with the value ofα=0.776 (see Table3).
**_Aesthetics_** refers to the characteristics of a stimulus,
including the appeal and attractiveness of an interface,
conveyed through graphics, color, and animation [73].

```
Students responded to two questions (A1, A2) in the category
of aesthetics, which were about the color scheme and the
content organization of MOOCs. The result of A1 shows
a statistically significant difference was found between
Coursera and edX (t=2.353 and p=0.019) and between
Coursera and Udemy (t=2.010 and p=0.046). The results of
the A2 did not give any significant differences (see Table4).
The results indicate that the UI patterns, i.e, color scheme,
content organization, and clickable card patterns, used in
Coursera’s aesthetics are more appealing compared to the
others (see Table6).
In the same context, Faisal et al.[5] argued that visual
arrangement refers to the planned organization and placement
of elements within a user interface to heighten usability,
readability, and overall user experience. Aesthetics is recog-
nized as a fundamental element of perceived usability[20].
Furthermore, Faisal et al.[6] also examined the influence
of aesthetics on involvement dimensions, including cognitive
and affective involvement, ultimately driving the intention to
continue using the system.
Typography refers to the visual appeal, attractiveness, and
readability of the text in the UI, designed to capture and
engage the user’s attention. Font quality describes the visual
presentation and arrangement of text, enhancing readability
and supporting effective information processing[6]. Two
questions(T1, T2) were posed concerning font style, color,
size, and button color, and the reliability of these questions
was considered acceptable (see Table3). Furthermore, the
statistical result of T1 indicates a significant difference in
typography between Coursera and edX (t= 2.027 and
p=0.044). However, no significant difference was found
between Coursera and Udemy. An important difference was
observed between edX and Udemy(t= −2.338 and p=
0.043). Similarly, the result of the T2 shows a significant
difference between Coursera and edX (t=2.725 and p=
0.007), and no difference was found between Coursera and
```

**TABLE 6.** Descriptive Statistics of Visual Design.

Udemy. A significant difference was observed between edX
and Udemy(t=−2.091 and p=0.038). The results are shown
in Table 5.
The analysis of mean values indicated that users rated UI
patterns of Udemy’s typography ( i.e, font size, font type,
button color) more positively, with a score of mean=4.262,
compared to Coursera and edX (see Table 6).
In a recent study, Vecino et al [74] argued that typography
significantly influences usability. Similarly, in other stud-
ies [75], [76], the authors highlighted the significant role of
typography in improving user experience, trust, and satisfac-
tion. Faisal et al. [8]also argued that typographical features
influence usability. Well-structured spacing between lines
and words, appropriate font color, style, and readable font size
create a visually appealing and reliable interface[52].

2) NAVIGATION
Navigation design defines how users access different parts
of the UI, impacting satisfaction and usability. Having
well-structured navigation reduces frustration and improves
the user experience. Designers use it to guide users efficiently
through tasks and content[5], [14],[77].
In the navigation category, five questions were presented
to evaluate the participants’ perceptions of the navigation
experience. The reliability of the questionnaire was 0.
(see Table3). The result of the first question (N1), which
was about the easy accessibility of the content, indicated
a significant difference between Coursera and edX ( t=
2.005 and p=0.046), and between Coursera and Udemy(t=
2.714 and p=0.007). However, no significant difference was
found between edX and Udemy. However, the results of N2,
N3, and N4 indicate that there were no significant differences
between the three prototypes in response to these two
questions. Another significant difference was found in N
between Coursera and Udemy (t=2.233 and p=0.027). The
result of the last question (N5), which was about user controls,
indicates a significant difference between Coursera and
Udemy(t=2.2333 and p=0.027). However, there was no
significant difference between Coursera and edX. Similarly,
there was no significant difference between edX and Udemy
(see Table7). However, after observing the mean values
as illustrated in Table8, participants perceived Coursera’s

```
TABLE 7. Pair t-test analysis of Navigation.
```
```
TABLE 8. Descriptive Statistics of Navigation.
```
```
UI patterns (i.e., tab navigation pattern, hamburger menu
pattern, drop-down pattern, floating action button pattern,
listview pattern) to provide better navigation than the other
two prototypes.
Navigation patterns improve usability and satisfac-
tion [14]. Incorporated suitable mobile navigation elements
such as patterns, transitions, hierarchy, buttons, links, paths,
and schemes, as these factors are important to enhance user
experience [54]. Similarly, Oh et al.[43] identified navigation
as a crucial design element of the MOOC platform that
significantly impacts learning experiences. Another recent
study by Faisal et al.[5] argued that user control features are
essential in learning environments, as they empower users to
manage their interactions.
```
```
3) INTERACTION DESIGN (CUSTOMIZATION)
Interaction design refers to how users manage and engage
with the information presented, encompassing aspects such
as customization and content management [78]. It also
refers to collaborative tools within online learning systems
that enhance interaction[66]. Customization refers to the
adaptation of content to align with individual needs. This
involves the ease with which portals can be modified
```

**TABLE 9.** Pair t-test analysis of Customization.

or customized according to user preferences, which is
recognized as a critical quality factor in improving customer
experiences and influencing utilization behavior [79], [80].
In this category, participants were asked eight questions
(C1 to C8) related to UI customization. The reliability
of the questions was also acceptable, with the value of
( _alpha_ =0.830), see Table 3. The analysis indicated a
statistically significant difference between Coursera and edX
for question C4, which addressed adoptability (t=2.096, p
=0.037). Similarly, a significant difference was observed
for question C5, concerning the availability of options in
different languages (t=2.523, p=0.012). Additionally,
question C8, related to customization options, also revealed a
significant difference between the two platforms (t=2.248, p
=0.026), see Table 9. The participants preferred Coursera’s
responsive UI patterns (i.e., filter and sort pattern, adaptive
layout patterns, and responsive cardview patterns, and tabbed
navigation pattern for settings) for its better customization,
and Udemy is the second most preferred among the three
prototypes(see Table 10).
In a recent study, Minas et al. [81] also explained that in
interaction design, customization is an important factor in the
user interface that increases usability and improves the
user experience. Zhan et al. [82] also discovered that
customization potentially increases user engagement.

4) INTERACTION DESIGN (RESPONSIVENESS)
Responsiveness is an important factor in user interface
usability that makes an application easy to use. An effective
design should continuously inform users about the system’s

```
TABLE 10. Descriptive Statistics of Customization.
```
```
state by providing timely and appropriate feedback[83].
Feedback includes progress, encouragement, support, precise
alerts, system status, and error prevention[29].
Seven questions (R1 to R7) were designed to evaluate
participants’ perceptions about responsiveness across the
three prototypes. The reliability analysis confirmed an
acceptable consistency level, with a Cronbach’s alpha value
ofα=0.840 (see Table3). The statistical analysis for R3,
concerning course completion progress information, revealed
a significant difference between Coursera and edX (t=2.149,
p=0.033). Likewise, R5, which addressed error correction
support, showed a statistically significant difference between
the same platforms (t=2.042, p=0.042). Additionally,
the result for R6, related to corrective feedback with
explanations, indicated a significant difference between edX
and Udemy (t=−2.829, p=0.005). No further significant
differences were identified (see Table 11). The findings
suggest that participants perceived Coursera’s UI patterns for
feedback (i.e., toast message patterns, alert dialogue pattern,
inline validation pattern) as the most effective in terms of
interaction responsiveness (see Table12).
Fath et al.[84] also examined that the system’s usability
and responsiveness correlate positively. In a recent study,
Faisal et al.[5] established that responsiveness significantly
influences focused immersion, temporal dissociation, and
curiosity of users. Previously, Multiple studies[33],[50],[85]
have identified responsiveness as a key factor influencing
trust, satisfaction, engagement, cognitive aspects, and the
intention to continue using a system.
```
```
B. PERCEIVED COGNITIVE LOAD (RQ2)
This study seeks to examine which MOOC platforms’ UI
design information architecture, which is a combination of
different UI design patterns, contributes to lower perceived
```

**TABLE 11.** Pair t-test analysis of Responsiveness.

**TABLE 12.** Descriptive Statistics of Responsiveness.

cognitive load on the user experience. The NASA Task Load
Index (NASA-TLX) is a commonly utilized tool to evaluate
cognitive load. It measures six factors: mental demand
(MD), physical demand (PD), temporal demand (TD),
performance, effort (PE), and frustration (F)[60]. Ali et al.
[61] applied NASA-TLX to the usability testing of users of
different age groups. Gani et al.[62] argued that the NASA
Task Load Index (NASA TLX) is an effective instrument
for collecting subjective feedback from participants. The
measurement scale utilized for the NASA-TLX in this study
ranges from 1 to 5, with 1 representing the lowest level
and 5 indicating the highest. Participants were asked five
questions regarding three prototypes to assess the impact of
the information architecture of UI design on cognitive load.
The specific NASA-TLX questions are presented in Table13.

```
The participants shared their insights, responding to six
NASA-TLX questions for each prototype. The quantitative
data was analyzed using SPSS 29.0, and the reliability of
questions was also calculated, which is acceptable with the
value ofα=0.711. A paired t-test was used to determine
whether there were significant differences in cognitive load
across the three prototypes.
```
```
1) MENTAL DEMAND
Mental demand refers to the level of cognitive and perceptual
effort required to complete a task, including activities
such as thinking, deciding, calculating, remembering, and
searching[15]. Participants were asked to evaluate how easy
or difficult, straightforward or complex, and precise the
tasks were on each MOOC platform. The analysis revealed
significant differences in perceived mental demand across all
prototypes (see Table14). Participants reported the highest
level of mental demand while using Udemy (M=3.975),
whereas edX was associated with a moderately lower level
(M=3.617). Coursera was perceived as the least mentally
demanding, with a mean score of 3.13 (see Table 15,
Fig. 5).
```
```
2) PHYSICAL DEMAND
Physical demand refers to the extent to which users felt
pressured by the pace of tasks, the amount of physical
effort required, and whether the task completion speed was
perceived as fast or slow[86]. The analysis of participant
responses revealed statistically significant differences in
perceived physical demand across the three MOOC platforms
(see Table16). Udemy was reported to have the highest
physical demand (M=4.024), followed by edX (M=3.786).
In contrast, Coursera was perceived as significantly less
physically demanding ( M=30243) (see Table17, Fig.5).
```
```
3) TEMPORAL DEMAND
Temporal demand refers to the time pressure and pacing of
tasks, which can influence a user’s stress levels—whether
the pace is perceived as comfortable and manageable or
rushed and overwhelming [87]. The analysis revealed a
statistically significant difference between Coursera and edX
(t=2.494 and p=0.013) and between Udemy and edX
(t = −2.725 and p = 0.007). However, no significant
difference was found between Coursera and Udemy (see
Table18). Although differences in mean values across the
three platforms were relatively small, Udemy was associated
with the highest temporal demand (M=3.358), followed
by edX (M=3.311). Coursera was perceived as having the
lowest temporal demand (M=3.034) (see Table19, Fig.5).
```
```
4) PERFORMANCE
Performance refers to participants’ perceptions of their
success in accomplishing task goals and their overall satis-
faction with their performance[87]. As shown in Table20,
a statistically significant difference was observed between
```

**TABLE 13.** NASA-TLX Questionnaire.

**TABLE 14.** Pair t-test analysis of Mental Demand.

**TABLE 15.** Descriptive Statistics of Mental Demand.

**TABLE 16.** Pair t-test analysis of Physical Demand.

**TABLE 17.** Descriptive Statistics of Physical Demand.

**TABLE 18.** Pair t-test analysis of Temporal Demand.

**TABLE 19.** Descriptive Statistics of Temporal Demand.

Coursera and edX (t= −6.057 and p=0.000), as well as
between Coursera and Udemy (t=6.278 and p=0.000).
No significant difference was found between Udemy and
edX. The findings indicate that Coursera was rated highest

```
TABLE 20. Pair t-test analysis of Performance.
```
```
TABLE 21. Descriptive Statistics of Performance.
```
```
TABLE 22. Pair t-test analysis of Effort.
```
```
in terms of perceived performance (M=2.955), followed by
edX, with Udemy ranked lowest (see Table 21, Fig. 5).
```
```
5) EFFORT
Effort refers to the mental effort participants had to exert
to achieve their desired level of performance while using
the mobile application. Consider the cognitive load required
to navigate the interface, complete tasks, and process infor-
mation. Was the UI intuitive and efficient, or did it require
significant effort to understand and use effectively [87].
The researchers identified a significant difference between
Coursera and edX(t = 4.862 and p =0.000), as well
as a notable difference between Coursera and Udemy(t=
−6.338 and p=0.000). However, no significant difference
was observed between edX and Udemy. The results are
displayed in the Table 22. Participants rated Udemy the
highest, indicating it required the most effort to complete
tasks compared to the other two prototypes. edX was ranked
second, while Coursera was perceived as the least demanding
in terms of effort( see Table 23, Fig. 5).
```
```
6) FRUSTRATION
The Frustration Level assesses how users felt during the
task, whether they experienced insecurity, discouragement,
```

**TABLE 23.** Descriptive Statistics of Effort.

**TABLE 24.** Pair t-test analysis of Frustration.

**TABLE 25.** Descriptive Statistics of Frustration.

irritation, stress, and annoyance, or instead felt secure,
gratified, content, relaxed, and complacent[87]. The results
in Table24 indicate a significant difference between Coursera
and edX(t=7.514 and p=0.000), as well as between
Coursera and Udemy(t=−9.192 and p=0.000). However,
no significant difference was observed between edX and
Udemy. The participants felt more frustrated while using
Udemy, and edX was in second place. Participants perceived
that they felt less frustrated while using Coursera (see
Table25, Fig.5).
The user interface design influences the cognitive
load[12]. Younas et al.[7] argued that ineffective interface
design can elevate cognitive load, ultimately diminishing
the learner’s intention to use the system. Alasmari[88] also
explored the effect of mobiles with small screen sizes on
cognitive load in the learning environment.

C. SATISFACTION (RQ3)
Satisfaction is how comfortable the user is with the
design [89]. Consequently, this study aimed to evaluate
participants’ overall satisfaction with the prototypes used in
the experimentation. The usability encompasses satisfaction
as a key component[90]. User satisfaction represents the
users’ overall perception and attitude toward the experience
of using mobile applications[91]. Several factors contribute
to overall satisfaction, including entertainment, usefulness,
aesthetic appeal, and a sense of reward[55].
To check the participant’s overall satisfaction while using
these prototypes, two questions (S1, S2) associated with
satisfaction were asked from this category, and the reliability
of these questions was Cronbach’s alpha value ofα=0.
(see Table 26). Furthermore, according to Table27, the
analysis indicates that the researchers found a significant
difference between Coursera and edX, with a t-sig value

```
TABLE 26. Satisfaction Questionnaire.
```
```
TABLE 27. Pair t-test analysis of Satisfaction.
```
```
TABLE 28. Descriptive Statistics of Satisfaction.
```
```
of 2.151 (p=0.033) in S1. In S2, a significant difference
was found between Coursera and edX with a t(sig) value of
2.648(0.009), and another significant difference was found
between Coursera and Udemy with a t(sig) value of 2.192(p=
0.029). The mean value indicates that participants feel more
satisfied using the Coursera prototype (see Table 28 and
Fig. 6).
```
```
V. RESULTS
The study, conducted in three phases, evaluated the impact
of UI design patterns on perceived usability, cognitive
load, and user satisfaction across three MOOC platforms:
Coursera, Udemy, and edX. Our empirical analysis of three
MOOC platforms reveals significant variations in UI pattern
effectiveness across usability, cognitive load, and satisfaction
metrics. In terms of perceived usability, Coursera was rated
highest for its aesthetically appealing elements such as
color schemes, content organization, and clickable card
patterns, while Udemy received more favorable feedback
on typography. Coursera also outperformed the others in
navigation due to effective use of tab navigation, hamburger
menus, and floating action buttons. For customization and
interaction responsiveness, Coursera was again preferred,
followed by Udemy. In assessing cognitive load, participants
reported that Udemy imposed the highest mental, physical,
and temporal demands, while Coursera was perceived as the
least demanding and most efficient, with higher performance
ratings and lower levels of required effort and frustration.
Finally, in terms of overall user satisfaction, the participants
```

**FIGURE 5.** Box Plot of NASA-TLX Cognitive Load Scores Across Coursera, edX, and Udemy.

**FIGURE 6.** Box Plot of User Satisfaction Ratings Across MOOCs.

expressed the greatest comfort and satisfaction with the
Coursera prototype, further affirming its superior UI design
in all the dimensions evaluated.

**VI. IMPLICATION**
The findings of this study carry several important impli-
cations for UI/UX designers, developers, and researchers
working in the domain of mobile learning platforms. First,
the study underscores the critical role of UI design patterns
in shaping user perceptions of usability, cognitive load, and
satisfaction. The superior performance of Coursera’s UI
prototype across all three evaluation phases suggests that
strategic implementation of specific patterns such as visually
cohesive aesthetics, intuitive navigation, responsive feed-
back, and customizable elements, can substantially improve
the learning experience on mobile devices. Designers should

```
prioritize such patterns to create interfaces that are not only
functionally effective but also emotionally engaging and
cognitively efficient.
For developers, these results emphasize the importance
of integrating adaptable and responsive UI elements that
accommodate diverse user needs and device constraints. The
ability of Coursera’s prototype to minimize user effort and
frustration demonstrates how thoughtful UI design can reduce
barriers to engagement and task completion, particularly in
educational contexts where cognitive overload may hinder
learning.
From a research perspective, this study contributes to the
growing body of knowledge linking micro-level UI patterns
to macro-level user experience outcomes. It moves beyond
generic assessments of usability by offering a pattern-level
analysis, thus providing a more granular understanding of
what design features matter most. Future studies can build
upon this work by exploring how these patterns perform in
different cultural, demographic, or domain-specific contexts,
and how they interact with individual differences in learning
style or cognitive capacity.
Overall, the study reinforces that user-centered UI design is
not merely an aesthetic concern but a foundational component
of effective digital learning systems. These implications
encourage interdisciplinary collaboration between educators,
designers, and engineers to create mobile interfaces that
are accessible, efficient, and satisfying for a wide range of
learners.
```
```
VII. CONCLUSION, LIMITATIONS, AND FUTURE WORK
This study provides empirical evidence on the role of
UI design patterns in shaping user experience across
mobile-based MOOC platforms, with a focus on perceived
usability, cognitive load, and user satisfaction. Through a
three-phase evaluation of prototypes modeled on Coursera,
Udemy, and edX, the findings highlight Coursera’s UI design
```

patterns as the most effective in enhancing user experience
across all assessed dimensions. The study confirms that
specific UI components such as color schemes, navigation
mechanisms, customization features, and responsive feed-
back patterns substantially influence perceived usability.
Typography elements were also found to be critical, partic-
ularly in Udemy’s prototype, suggesting that legibility and
visual hierarchy play a key role in user engagement.
The cognitive load analysis further indicated that Cours-
era’s design minimized mental, physical, and temporal
demand, leading to higher perceived performance and lower
frustration. In terms of satisfaction, users consistently favored
Coursera’s interface, emphasizing the value of cohesive
and intuitive information architecture in learning environ-
ments. These findings offer both theoretical and practical
contributions: for researchers, they advance understanding
of the interplay between UI patterns and user experience
constructs; for practitioners, they inform evidence-based UI
design strategies for mobile educational platforms.
Despite the contributions, this study has a few limitations.
First, the use of experimental prototypes, while controlled for
consistency, may not fully replicate real-world usage contexts
or content dynamics of live MOOC platforms. Second, the
participant pool may lack diversity in demographics such
as age, cultural background, or technological familiarity,
which could influence user perceptions. Third, the study
focused solely on three MOOC platforms, which limits the
generalizability of the findings across the broader e-learning
ecosystem.
Future work could explore a more diverse range of users
to assess how demographic factors such as gender, age,
or educational background influence interaction with UI
patterns. Additionally, future research might investigate the
role of device-specific variables, such as screen size and oper-
ating system, in shaping usability and cognitive responses.
Longitudinal studies could also offer insight into how user
preferences evolve with continued use, providing a deeper
understanding of sustained engagement and satisfaction in
mobile learning environments.
**Data availability** : The datasets generated during and/or
analyzed during the current study are available from the
corresponding author upon reasonable request.
**Conflict of interest** : The authors declare that there are no
conflicts of interest regarding the publication of this paper.
**Consent to participate:** The research involves the par-
ticipation of the National Textile University and the FAST
National University, Chiniot-Faisalabad campus. The cor-
responding authors are free to contact any of the people
involved in the study to seek further clarification and
information.

**ACKNOWLEDGMENT**
This work has been partially funded by Italy’s Ministry
of Universities and Research: CNR, AR Prog. 01.
Sept. INF/01 DR n. 3916, 28/10/2022, (SmaTh4SD-CUP:
H99J21017510006).

```
REFERENCES
[1] M. Altalhi, ‘‘Toward the sustainability of mobile learning applications in
higher education: An empirical study,’’ Universal Access Inf. Soc. , vol. 23,
no. 3, pp. 1103–1113, Aug. 2024.
[2] M. Soegaard, ‘‘Interaction design foundation: The basic of user experi-
ence design. SL: Interaction design foundation,’’ Interaction-Design.Org,
Tech. Rep., pp. 29–33, 2002.
[3] G. R. Morales, A. P. Gallegos, P. V. Torres-Carrión, and S. C. Carrión,
‘‘Comparative evaluation of the overall user experience of two MOOC
platforms: Coursera and OpenCampus,’’ in Developments and Advances
in Defense and Security: Proceedings of MICRADS 2022. Cham,
Switzerland: Springer, 2023, pp. 179–190.
[4] P. Rodríguez-Torrico, S. San-Martín, and R. San José-Cabezudo, ‘‘What
drives M-shoppers to continue using mobile devices to buy?’’ J. Marketing
Theory Pract. , vol. 27, no. 1, pp. 83–102, Jan. 2019.
[5] C. M. N. Faisal, A. Younas, J. De Andrés, D. Fernandez-Lanvin, and
M. Gonzalez-Rodriguez, ‘‘The effects of appearance and organization
and information architecture on the continued intention to use MOOCs,’’
Universal Access Inf. Soc. , vol. 24, no. 3, pp. 2219–2237, Aug. 2025.
[6] C. M. N. Faisal, D. Fernandez-Lanvin, J. De Andrés, and M. Gonzalez-
Rodriguez, ‘‘Design quality in building behavioral intention through
affective and cognitive involvement for e-learning on smartphones,’’
Internet Res. , vol. 30, no. 6, pp. 1631–1663, Jul. 2020.
[7] A. Younas, C. M. N. Faisal, M. A. Habib, R. Ashraf, and M. Ahmad, ‘‘Role
of design attributes to determine the intention to use online learning via
cognitive beliefs,’’ IEEE Access , vol. 9, pp. 94181–94202, 2021.
[8] C. M. N. Faisal, J. De Andres-Suarez, M. Gonzalez-Rodriguez,
D. Fernandez-Lanvin, M. Ahmad, and M. A. Habib, ‘‘Impact of web
design features on irritation for e-commerce websites,’’ in Proc. 33rd Annu.
ACM Symp. Appl. Comput. New York, NY, USA: ACM Press, Apr. 2018,
pp. 656–663.
[9] D. Cyr, M. Head, E. Lim, and A. Stibe, ‘‘Using the elaboration likelihood
model to examine online persuasion through website design,’’ Inf.
Manage. , vol. 55, no. 7, pp. 807–821, Nov. 2018.
[10] J. M. N. Ribeiro, ‘‘Web design patterns for mobile devices,’’ Fac. Fine
Arts, Univ. Porto, Portoo, Portugal, Tech. Rep., 2012. [Online]. Available:
https://repositorio-aberto.up.pt/handle/10216/64860?mode=full
[11] H. Hoehle, R. Aljafari, and V. Venkatesh, ‘‘Leveraging Microsoft’s mobile
usability guidelines: Conceptualizing and developing scales for mobile
application usability,’’ Int. J. Hum.-Comput. Stud. , vol. 89, pp. 35–53,
May 2016.
[12] M. A. Faudzi, Z. C. Cob, M. Ghazali, R. Omar, and S. A. Sharudin,
‘‘User interface design in mobile learning applications: Developing and
evaluating a questionnaire for measuring learners’ extraneous cognitive
load,’’ Heliyon , vol. 10, no. 18, Sep. 2024, Art. no. e37494.
[13] D. Tao, P. Fu, Y. Wang, T. Zhang, and X. Qu, ‘‘Key character-
istics in designing massive open online courses (MOOCs) for user
acceptance: An application of the extended technology acceptance
model,’’ Interact. Learn. Environments , vol. 30, no. 5, pp. 882–895,
May 2022.
[14] M. Umar, I. Hussain, T. Mahmood, H. T. Mirza, and C. M. N. Faisal,
‘‘Design strategies to minimize mobile usability issues in navigation design
patterns,’’ Information , vol. 15, no. 11, p. 732, Nov. 2024.
[15] T. Kosch, J. Karolus, J. Zagermann, H. Reiterer, A. Schmidt, and
P. W. Woźniak, ‘‘A survey on measuring cognitive workload in human–
computer interaction,’’ ACM Comput. Surveys , vol. 55, no. 13s, pp. 1–39,
Dec. 2023.
[16] T. Natarajan, S. A. Balasubramanian, and D. L. Kasilingam, ‘‘The
moderating role of device type and age of users on the intention to
use mobile shopping applications,’’ Technol. Soc. , vol. 53, pp. 79–90,
May 2018.
[17] J. Dunaway and S. Soroka, ‘‘Smartphone-size screens constrain cognitive
access to video news stories,’’ Inf., Commun. Soc. , vol. 24, no. 1, pp. 69–84,
Jan. 2021.
[18] M. Xiang, L. Sha, and Z. Qilin, ‘‘User satisfaction model of functional
animation design in the digital technology perspective based on TAM,’’
in Proc. Int. Conf. Innov. Design Digit. Technol. (ICIDDT) , Dec. 2020,
pp. 301–305.
[19] M. Ballantyne, A. Jha, A. Jacobsen, J. S. Hawker, and Y. N. El-
Glaly, ‘‘Study of accessibility guidelines of mobile applications,’’ in
Proc. 17th Int. Conf. Mobile Ubiquitous Multimedia , Nov. 2018,
pp. 305–315.
```

[20] M. Soui, M. Chouchane, N. Bessghaier, M. W. Mkaouer, and M.
Kessentini, ‘‘On the impact of aesthetic defects on the maintainability of
mobile graphical user interfaces: An empirical study,’’ _Inf. Syst. Frontiers_ ,
vol. 24, no. 2, pp. 659–676, Apr. 2022.
[21] V. Sharma, K. Jangir, M. Gupta, and R. Rupeika-Apoga, ‘‘Does service
quality matter in FinTech payment services? An integrated SERVQUAL
and TAM approach,’’ _Int. J. Inf. Manage. Data Insights_ , vol. 4, no. 2,
Nov. 2024, Art. no. 100252.
[22] A. H. Cano Bejar, S. Ray, and Y. H. Huang, ‘‘Fighting for the status quo:
Threat to tech self-esteem and opposition to competing smartphones,’’ _Inf.
Manage._ , vol. 60, no. 2, Mar. 2023, Art. no. 103748.
[23] B. Curum and K. K. Khedo, ‘‘Cognitive load management in mobile
learning systems: Principles and theories,’’ _J. Comput. Educ._ , vol. 8, no. 1,
pp. 109–136, Mar. 2021.
[24] A. Occa and S. E. Morgan, ‘‘The role of cognitive absorption in
the persuasiveness of multimedia messages,’’ _Comput. Educ._ , vol. 176,
Jan. 2022, Art. no. 104363.
[25] P. Weichbroth, ‘‘Usability of mobile applications: A systematic literature
study,’’ _IEEE Access_ , vol. 8, pp. 55563–55577, 2020.
[26] N. H. Nasrudin, S. Ahmad, K. A. Salleh, and L. A. Azahari, ‘‘A systematic
review of user mental models on applications sustainability,’’ _Int. J.
Sustain. Construct. Eng. Technol._ , vol. 14, no. 3, pp. 376–389, 2023.
[27] S. Suleri, Y. Hajimiri, and M. Jarke, ‘‘Impact of using UI design patterns
on the workload of rapid prototyping of smartphone applications: An
experimental study,’’ in _Proc. 22nd Int. Conf. Hum.-Comput. Interact.
Mobile Devices Services_ , Oct. 2020, pp. 1–5.
[28] I. D. Sabukunze and A. Arakaza, ‘‘User experience analysis on mobile
application design using user experience questionnaire,’’ _Indonesian J. Inf.
Syst._ , pp. 15–26, Aug. 2021.
[29] C. X. Navarro-Cota, A. I. Molina, M. A. Redondo, and C. Lacave, ‘‘A
comprehensive usability measurement tool for m-learning applications,’’
_IEEE Trans. Educ._ , vol. 67, no. 2, pp. 209–223, Apr. 2024.
[30] S. J. Barnes, A. D. Pressey, and E. Scornavacca, ‘‘Mobile ubiquity:
Understanding the relationship between cognitive absorption, smartphone
addiction and social network services,’’ _Comput. Hum. Behav._ , vol. 90,
pp. 246–258, Jan. 2019.
[31] N. Tuli and A. Mantri, ‘‘Evaluating usability of mobile-based augmented
reality learning environments for early childhood,’’ _Int. J. Hum.-Comput.
Interact._ , vol. 37, no. 9, pp. 815–827, May 2021.
[32] F. Hanis, M. Asri, D. Singh, Z. Mansor, and H. Norman, ‘‘A review
of cross-cultural design to improve user engagement for learning
management system,’’ _KSII Trans. Internet Inf. Syst._ , vol. 18, no. 2,
pp. 397–419, 2024.
[33] (2024). _The Big Three Platforms Revisited: The Latest on Coursera,
EDX, & Udemy_. [Online]. Available: https://www.encoura.org/resources/
wake-up-call/the-big-three-platforms-revisited-the-latest-on-coursera-
edx-udemy/
[34] K. Ghoulam, B. Bouikhalene, A. Babori, and N. Falih, ‘‘Exploring the
impact of mobile devices in electronics E-learning: A case study evaluating
the effectiveness of mobile learning applications in the field of electronics
and sensors,’’ _Adv. Mobile Learn. Educ. Res._ , vol. 4, no. 2, pp. 1058–1072,
Jun. 2024.
[35] Z. Shao and K. Chen, ‘‘Understanding individuals’ engagement and
continuance intention of MOOCs: The effect of interactivity and the role
of gender,’’ _Internet Res._ , vol. 31, no. 4, pp. 1262–1289, Jul. 2021.
[36] S. A. Nikou, ‘‘Factors influencing student teachers’ intention to use mobile
augmented reality in primary science teaching,’’ _Educ. Inf. Technol._ ,
vol. 29, pp. 15353–15374, Jan. 2024.
[37] A. Tarute, S. Nikou, and R. Gatautis, ‘‘Mobile application driven consumer
engagement,’’ _Telematics Informat._ , vol. 34, no. 4, pp. 145–156, Jul. 2017.
[38] S. A. Nikou and A. A. Economides, ‘‘Mobile-based assessment: Investigat-
ing the factors that influence behavioral intention to use,’’ _Comput. Educ._ ,
vol. 109, pp. 56–73, Jun. 2017.
[39] R. Alnanih and O. Ormandjieva, ‘‘Mapping HCI principles to design
quality of mobile user interfaces in healthcare applications,’’ _Proc. Comput.
Sci._ , vol. 94, pp. 75–82, Jun. 2016.
[40] J. Vanderdonckt, ‘‘Automatic user interface generation from declarative
model,’’ in _Proc. 2nd Int. Conf. Comput.-Aided Design User Interfaces_ ,
2024, pp. 4–61. [Online]. Available: https://books.google.com.pk/books?
[41] A. Liapis, V. Maratou, T. Panagiotakopoulos, C. Katsanos, and A. Kameas,
‘‘UX evaluation of open MOOC platforms: A comparative study between
moodle and open edX combining user interaction metrics and wearable
biosensors,’’ _Interact. Learn. Environ._ , vol. 31, no. 10, pp. 6841–6855,
Dec. 2023.

```
[42] Y.-M. Cheng, ‘‘Can gamification and interface design aesthetics lead
to MOOCs’ success?’’ Edu. + Training , vol. 63, no. 9, pp. 1346–1375,
Nov. 2021.
[43] E. Oh, M. Cho, and Y. Chang, ‘‘Learners’ perspectives on MOOC design,’’
Distance Educ. , vol. 44, no. 3, pp. 476–494, 2023.
[44] P.-A. Cinquin, P. Guitton, and H. Sauzéon, ‘‘Designing accessible
MOOCs to expand educational opportunities for persons with cognitive
impairments,’’ Behav. Inf. Technol. , vol. 40, no. 11, pp. 1101–1119,
Aug. 2021.
[45] D. Cyr, ‘‘Website design, trust and culture: An eight country investigation,’’
Electron. Commerce Res. Appl. , vol. 12, no. 6, pp. 373–385, Nov. 2013.
[46] P. Lugtig and V. Toepoel, ‘‘The use of PCs, smartphones, and tablets in
a probability-based panel survey: Effects on survey measurement error,’’
Social Sci. Comput. Rev. , vol. 34, no. 1, pp. 78–94, Feb. 2016.
[47] D. Shin, M. Choi, J. Hyun Kim, and J.-G. Lee, ‘‘Interaction, engagement,
and perceived interactivity in single-handed interaction,’’ Internet Res. ,
vol. 26, no. 5, pp. 1134–1157, Oct. 2016.
[48] S. Sánchez-Gordón, M. Sánchez-Gordón, M. Yilmaz, and R. V. O’Connor,
‘‘Integration of accessibility design patterns with the software implemen-
tation process of ISO/IEC 29110,’’ J. Softw., Evol. Process , vol. 31, no. 1,
p. e1987, Jan. 2019.
[49] T. Neil, Mobile Design Pattern Gallery , 2nd ed., Sebastopol, CA, USA:
O’Reilly Media, Inc., 2015. [Online]. Available: https://www.safaribooks
online.com/library/view/mobile-design-pattern/9781449368586/
[50] J. Tidwell, Designing Interfaces: Patterns for Effective Interaction Design.
Sebastopol, CA, USA: O’Reilly Media, 2020. [Online]. Available:
https://books.google.com.pk/books?hl
[51] M. Donati, G. Mori, and F. Paternò, ‘‘Understanding the transitions
between web interfaces designed to stimulate specific emotions,’’ Univer-
sal Access Inf. Soc. , vol. 19, no. 2, pp. 391–407, Jun. 2020.
[52] C. M. N. Faisal, M. Gonzalez-Rodriguez, D. Fernandez-Lanvin, and
J. de Andres-Suarez, ‘‘Web design attributes in building user trust,
satisfaction, and loyalty for a high uncertainty avoidance culture,’’ IEEE
Trans. Hum.-Mach. Syst. , vol. 47, no. 6, pp. 847–859, Dec. 2017.
[53] N. Bonnardel, A. Piolat, and L. Le Bigot, ‘‘The impact of colour on website
appeal and users’ cognitive processes,’’ Displays , vol. 32, no. 2, pp. 69–80,
Apr. 2011.
[54] C. M. N. Faisal, S. Shahid, J. D. A. Suarez, M. Gonzalez-Rodriguez, and
D. F. Lanvin, ‘‘The influence of mobile app design on emotions leads to
purchase intention for risk avoidance cultures,’’ Int. J. Mobile Commun. ,
vol. 24, no. 3, pp. 225–255, 2024.
[55] L. Punchoojit and N. Hongwarittorrn, ‘‘Usability studies on mobile user
interface design patterns: A systematic literature review,’’ Adv. Hum.-
Comput. Interact. , vol. 2017, pp. 1–22, Sep. 2017.
[56] S. McCarthy, W. Rowan, N. Kahma, L. Lynch, and T. P. Ertiö, ‘‘Open
e-learning platforms and the design-reality gap: An affordance theory
perspective,’’ Inf. Technol. People , vol. 35, no. 8, pp. 74–98, Dec. 2021.
[57] M. Benaida, ‘‘Significance of culture toward the usability of web design
and its relationship with satisfaction,’’ Universal Access Inf. Soc. , vol. 21,
no. 3, pp. 625–638, Aug. 2022.
[58] J. Nielsen, Usability Engineering. San Mateo, CA, USA: Morgan
Kaufmann, 1994.
[59] A. Ospankhan and Z. Kalpeyeva, ‘‘User preferences for UI design
elements: Impact on learning and skill development on coursera,
edx, and stepik,’’ Satpayev Univ., Almaty, Kazakhstan, Tech. Rep.,
```
2024. [Online]. Available: https://api.dspace.khadi.kharkov.ua/server/api/
core/bitstreams/bb73540d-6d4a-471a-9256-227996ef4655/content
[60] M. E. Nenni, ‘‘Integrating mental workload management in advanced
human-machine interaction: The development process of the proof-of-
concept to refine the concept,’’ in _Proc. Int. Congr. Hum.-Comput.
Interact., Optim. Robotic Appl. (HORA)_ , May 2024, pp. 1–6.
[61] W. Ali, O. Riaz, S. Mumtaz, A. R. Khan, T. Saba, and S. A. Bahaj, ‘‘Mobile
application usability evaluation: A study based on demography,’’ _IEEE
Access_ , vol. 10, pp. 41512–41524, 2022.
[62] S. A. G. Fatimah, A. Rahmati, and S. Bahri, ‘‘Analysis of mental burden of
students based on NASA-TLX at DAYAH DMA,’’ _TEKNOSAINS, Jurnal
Sains, Teknologi dan Informatika_ , vol. 12, no. 1, pp. 46–53, Jan. 2025.
[63] M. Calvano, A. Curci, C. M. N. Faisal, A. Piccinno, and Q. Sohail,
‘‘Usability aspects reduce design complexity and help prevent use-
related errors in icu ventilators,’’ in _Proc. 1st Int. Workshop Participatory
Design End-User Develop.-Building Bridges_ , 2024. [Online]. Available:
https://ceur-ws.org/Vol-3778/short6.pdf


[64] D. Grant-Smith, T. Donnet, J. Macaulay, and R. Chapman, ‘‘Principles
and practices for enhanced visual design in virtual learning environments:
Do looks matter in student engagement?’’ in _Student-centered Virtual
Learning Environments in Higher Education_. Hershey, PA, USA: IGI
Global, 2019, pp. 103–133.
[65] J. D. Bader and P. R. Lowenthal, ‘‘Using visual design to
improve the online learning experience: A synthesis of research
on aesthetics,’’ in _Visual Design for Online Learning_. USA: IGI
Global, 2018, pp. 1–35. [Online]. Available: https://services.igi-global.
com/resolvedoi/resolve.aspx?doi=10.4018/978-1-5225-4206-3.ch
[66] A. Alshehri, M. Rutter, and S. Smith, ‘‘Assessing the relative importance of
an E-learning system’s usability design characteristics based on students’
preferences,’’ _Eur. J. Educ. Res._ , vol. 8, no. 3, pp. 839–855, 2019.
[67] L. F. da Silva, P. A. P. Junior, and A. P. Freire, ‘‘Mobile user interaction
design patterns: A systematic mapping study,’’ _Information_ , vol. 13, no. 5,
p. 236, May 2022.
[68] Y. Liu, H. Tan, G. Cao, and Y. Xu, ‘‘Enhancing user engagement through
adaptive UI/UX design: A study on personalized mobile app interfaces,’’
_World J. Innov. Modern Technol._ , vol. 7, no. 5, pp. 1–21, Sep. 2024.
[69] M. K. A. Braham, F. Buendía, and F. Gargouri, ‘‘Generation of adaptive
mobile applications based on design patterns for user interfaces,’’
_Proceedings_ , vol. 31, no. 1, p. 19, 2019.
[70] _Design Patterns_. Accessed: May 25, 2025. [Online]. Available: https://ui-
patterns.com/patterns
[71] C. Gurkan, ‘‘Development of Android-based Internet of Things application
for data tracking in smart marble factories,’’ _J. Artif. Intell. Data Sci._ , vol. 1,
no. 1, pp. 41–44, 2021.
[72] N. K. S. Suleri, M. Jarke, and L. C. Tran, ‘‘UI design pattern-driven rapid
prototyping for agile development of mobile applications,’’ in _Proc. 21st
Int. Conf. Hum.-Comput. Interact. Mobile Devices Services (MobileHCI)_ ,
Jun. 2019.
[73] J.-E. Pelet, B. Taieb, M. Monia, B. D. M. Norchene, M. Prashant, Z. Zaid,
and M. O. Joanna, ‘‘Impact of M-commerce website design on consumers’
behavioral intentions: An empirical study of age as a moderating
influence,’’ in _Developments in Marketing Science: Proceedings of the
Academy of Marketing Science_. Cham, Switzerland: Springer, 2017,
pp. 111–124.
[74] S. Vecino, M. Gonzalez-Rodriguez, D. Fernandez-Lanvin, and J. de
Andres, ‘‘The impact of serif vs sans-serif typefaces on e-commerce
websites,’’ _Int. J. Hum.-Comput. Interact._ , vol. 41, no. 5, pp. 3613–3624,
2025.
[75] M. Elias, K. Dick, and S. Paulo, ‘‘Influência das propriedades
tipográficas na experiência do usuário em interfaces digitais,’’ Tech. Rep.,
2023, pp. 99–109. [Online]. Available: https://www.researchgate.net/
publication/372680191_Influence_of_typographic_properties_on_user_
experience_in_digital_interfaces
[76] J. Wang, J. Yin, S. Deng, Y. Li, C. Pu, Y. Tang, and Z. Luo, ‘‘Evaluating
user satisfaction with typography designs via mining touch interaction
data in mobile reading,’’ in _Proc. CHI Conf. Hum. Factors Comput. Syst._ ,
Apr. 2018, pp. 1–12.
[77] R. P. Da Costa, E. D. Canedo, R. T. De Sousa, R. De Oliveira
Albuquerque, and L. J. García Villalba, ‘‘Set of usability heuristics for
quality assessment of mobile applications on smartphones,’’ _IEEE Access_ ,
vol. 7, pp. 116145–116161, 2019.
[78] M. L. Jensen, N. E. Dunbar, M. S. Connelly, W. D. Taylor, M. Hughes,
B. Adame, and B. Rozzell, ‘‘Organizational balancing of website
interactivity and control: An examination of ideological groups and the
duality of goals,’’ _Comput. Hum. Behav._ , vol. 38, pp. 43–54, Sep. 2014.
[79] A. Dirin, M. Nieminen, and T. H. Laine, ‘‘Feelings of being for mobile
user experience design,’’ _Int. J. Hum.-Comput. Interact._ , vol. 39, no. 20,
pp. 4059–4079, Dec. 2023.
[80] A. M. Mutawa and S. Sruthi, ‘‘Enhancing human–computer interaction
in online education: A machine learning approach to predicting student
emotion and satisfaction,’’ _Int. J. Hum.-Comput. Interact._ , vol. 40, no. 24,
pp. 8827–8843, Dec. 2024.
[81] D. Minas, E. Theodosiou, K. Roumpas, and M. Xenos, ‘‘Adaptive real-
time translation assistance through eye-tracking,’’ _AI_ , vol. 6, no. 1, p. 5,
Jan. 2025.
[82] X. Zhan, Y. Xu, and Y. Liu, ‘‘Personalized UI layout generation using
deep learning: An adaptive interface design approach for enhanced user
experience,’’ _J. Artif. Intell. Gen. Sci._ , vol. 6, no. 1, pp. 463–478, Dec. 2024.

```
[83] The Impact of Interaction Design on Brand Perception. Accessed: Jul. 26,
```
2025. [Online]. Available: https://www.nngroup.com/articles/interaction-
branding/
[84] S. Fath, D. Abimanyu, and M. Misbak, ‘‘Exploring the relationship
between responsiveness and usability and its impact on customer
satisfaction in e-commerce,’’ _J. Manage., Econ., Financial_ , vol. 2, no. 4,
pp. 72–79, Jul. 2024.
[85] E. G. Nilsson, ‘‘Design patterns for user interface for mobile applications,’’
_Adv. Eng. Softw._ , vol. 40, no. 12, pp. 1318–1328, Dec. 2009.
[86] T. J. T. E. Rossiter and R. Fitzgerald, ‘‘Supporting university students’
learning across time and space: A from-scratch, personalised and mobile-
friendly approach,’’ _Interact. Technol. Smart Educ._ , vol. 21, no. 1,
pp. 108–130, Jan. 2024.
[87] S. Criollo, A. Guerrero-Arias, D. Buenaño Fernández, A. Jaramillo-
Alcazar, and S. Luján-Mora, _Using Mixed Reality (MR) as an Emerging
Technology for Improving Higher Education: Analysis of Mental Work-
load_. Ital Publication, 2024. [Online]. Available: https://rua.ua.es/server/
api/core/bitstreams/aecae92a-9afd-4b28-813c-508f6b2544c7/content
[88] T. Alasmari, ‘‘The effect of screen size on students’ cognitive load in
mobile,’’ _J. Educ., Teach. Learn._ , vol. 5, no. 2, pp. 280–295, 2020.
[89] A. S. Nimgaonkar and R. Kumbhar, ‘‘Usability—A key to security and
utility: Case of core banking system,’’ in _Proc. Int. Conf. Emerg. Smart
Comput. Informat. (ESCI)_ , Mar. 2024, pp. 1–6.
[90] O. Thinnukool and N. Kongchouy, ‘‘The User’s satisfaction of graphic user
interface in designing for health care mobile application,’’ _J. Telecommun._ ,
vol. 9, pp. 11–15, Sep. 2017.
[91] B. A. Kumar and P. Mohite, ‘‘Usability of mobile learning applications:
A systematic literature review,’’ _J. Comput. Educ._ , vol. 5, no. 1, pp. 1–17,
Mar. 2018.

```
TAHIR FAROOQ received the B.S. and M.S.
degrees in computer science from National Textile
University, Faisalabad, Pakistan, where he is
currently pursuing the Ph.D. degree. His research
interests include UI/UX design and user interface
design usability.
```
```
C. M. NADEEM FAISAL received the B.S.
degree in information technology from AIOU,
Pakistan, in 2005, the M.S. degree in computer
science from Blekinge Institute of Technology,
Sweden, in 2009, and the Ph.D. degree in computer
engineering from the University of Oviedo, Spain,
in 2017. He undertook his first Postdoctoral
Research in HCI with the University of Oviedo,
in 2019, and later completed a second research
fellowship in AI and the IoT with the University
of Bari, Italy, in 2025. His research has been published in reputable
international journals and conferences. He has actively contributed to
numerous EU-funded and global research collaborations. He currently
an Assistant Professor with the National Textile University, Pakistan.
He is a Researcher with the Interaction, Visualization, Usability & UX
Laboratory (IVU Laboratory), Department of Computer Science, University
of Bari, Italy. His research interests encompass artificial intelligence,
human–computer interaction, user experience design, and smart systems,
with a strong commitment to addressing real-world challenges through
innovative, human-centered technology.
```

JAVIER DE ANDRES received the B.S. and
Ph.D. degrees in economics from the University
of Oviedo, Oviedo, Spain, in 1993 and 1998,
respectively. He is currently a Full Professor of
accounting and finance with the University of
Oviedo, Oviedo, Spain. He has published more
than 50 chapters in books and articles in refereed
scientific journals. His research interests include
usability and accessibility of business information
systems, artificial intelligence systems for the
analysis of credit risk, enterprise resource planning systems, and XBRL.

ZAFAR SAEEDreceived the Ph.D. degree in
computer science from Quaid-i-Azam University,
Islamabad. He was a Research Scholar with
the University of Technology, Sydney (UTS),
Australia. He is currently an Assistant Professor
with the University of Bari Aldo Moro, Italy.
His research interests include knowledge graph
embeddings, particularly negative sampling meth-
ods for link prediction, social media networks, and
content analysis. He has published several articles
in high-impact factor journals, contributing to advancements in machine
learning, natural language processing (NLP), and temporal data stream
analysis. His research interests include knowledge graph representation
learning, social media analytics, and AI-driven data mining. He continues to
explore novel techniques for improving knowledge graph embeddings and
applying machine learning to real-world problems in social networks and
NLP.

```
SAJID ANWERreceived the bachelor’s degree in
computer science from the COMSATS Institute
of Information Technology, Lahore, Pakistan, the
master’s degree in computer science from the King
Fahd University of Petroleum and Minerals, and
the Ph.D. degree from the School of ICT, Griffith
University. He is currently an Assistant Professor
with the Department of Software Engineering,
College of Computer Engineering and Sciences,
Prince Sattam Bin Abdulaziz University, Al-Kharj,
Saudi Arabia. Prior to joining his current position, he was an Assistant
Professor with the Department of Software Engineering, FAST-National
University of Computer and Emerging Sciences, Chiniot-Faisalabad Cam-
pus, and as a Lecturer with the King Fahd University of Petroleum and
Minerals, Saudi Arabia. His research interests include global software
engineering, software requirements engineering, behavior engineering, and
software security.
```
```
TOQEER MAHMOODreceived the M.S. degree
in computer engineering from the Center for
Advanced Studies in Engineering (CASE),
Islamabad, Pakistan, in 2010, and the Ph.D. degree
in computer engineering from the University of
Engineering and Technology, Taxila, Pakistan,
in 2017. He is currently an Assistant Professor
of computer science and engineering with the
National Textile University, Faisalabad, Pakistan.
He has authored or co-authored many scientific
papers in conferences and journals of international repute. His research
interests include image processing, image retrieval, steganography, data
science, and numerical techniques with particular attention to multimedia
forensics. He is serving as an Academic Editor of mathematical problems in
engineering (Hindawi). He has been serving as a Reviewer for The Visual
Computer , ETRI Journal , Journal of Information Security and Applications ,
Australian Journal of Forensic Sciences , Forensic Science International ,
IEEE ACCESS, IEEE TRANSACTIONS ONCIRCUITS ANDSYSTEMS FORVIDEO, IEEE
TRANSACTIONS ONINTELLIGENTTRANSPORTATIONSYSTEMS, Journal of Internet
Technology.
```

