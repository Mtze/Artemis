package de.tum.in.www1.artemis.util;

import java.time.ZonedDateTime;
import java.util.*;

import com.google.common.collect.Sets;

import de.tum.in.www1.artemis.domain.*;
import de.tum.in.www1.artemis.domain.enumeration.*;
import de.tum.in.www1.artemis.domain.modeling.ModelingExercise;
import de.tum.in.www1.artemis.domain.modeling.ModelingSubmission;

public class ModelFactory {

    public static ModelingExercise generateModelingExercise(ZonedDateTime releaseDate, ZonedDateTime dueDate, ZonedDateTime assessmentDueDate, DiagramType diagramType,
            Course course) {
        ModelingExercise modelingExercise = new ModelingExercise();
        modelingExercise = (ModelingExercise) populateExercise(modelingExercise, releaseDate, dueDate, assessmentDueDate, course);
        modelingExercise.setDiagramType(diagramType);
        return modelingExercise;
    }

    public static TextExercise generateTextExercise(ZonedDateTime releaseDate, ZonedDateTime dueDate, ZonedDateTime assessmentDueDate, Course course) {
        TextExercise textExercise = new TextExercise();
        return (TextExercise) populateExercise(textExercise, releaseDate, dueDate, assessmentDueDate, course);
    }

    public static FileUploadExercise generateFileUploadExercise(ZonedDateTime releaseDate, ZonedDateTime dueDate, ZonedDateTime assessmentDueDate, String filePattern,
            Course course) {
        FileUploadExercise fileUploadExercise = new FileUploadExercise();
        fileUploadExercise = (FileUploadExercise) populateExercise(fileUploadExercise, releaseDate, dueDate, assessmentDueDate, course);
        fileUploadExercise.setFilePattern(filePattern);
        return (FileUploadExercise) populateExercise(fileUploadExercise, releaseDate, dueDate, assessmentDueDate, course);
    }

    public static Exercise populateExercise(Exercise exercise, ZonedDateTime releaseDate, ZonedDateTime dueDate, ZonedDateTime assessmentDueDate, Course course) {
        exercise.setTitle(UUID.randomUUID().toString());
        exercise.setShortName("t" + UUID.randomUUID().toString().substring(0, 3));
        exercise.setMaxScore(5.0);
        exercise.setReleaseDate(releaseDate);
        exercise.setDueDate(dueDate);
        exercise.assessmentDueDate(assessmentDueDate);
        exercise.setCourse(course);
        exercise.setStudentParticipations(new HashSet<>());
        exercise.setExampleSubmissions(new HashSet<>());
        exercise.setTutorParticipations(new HashSet<>());
        exercise.setDifficulty(DifficultyLevel.MEDIUM);
        exercise.setCategories(new HashSet<>());
        return exercise;
    }

    public static LinkedList<User> generateActivatedUsers(String loginPrefix, String[] groups, int amount) {
        LinkedList<User> generatedUsers = new LinkedList<>();
        for (int i = 1; i <= amount; i++) {
            User student = ModelFactory.generateActivatedUser(loginPrefix + i);
            student.setGroups(Sets.newHashSet(groups));
            generatedUsers.add(student);
        }
        return generatedUsers;
    }

    public static User generateActivatedUser(String login) {
        User user = new User();
        user.setLogin(login);
        user.setPassword("0000");
        user.setFirstName(login + "First");
        user.setLastName(login + "Last");
        user.setEmail(login + "@test.de");
        user.setActivated(true);
        user.setLangKey("en");
        user.setGroups(new HashSet<>());
        user.setAuthorities(new HashSet<>());
        return user;
    }

    public static Course generateCourse(Long id, ZonedDateTime startDate, ZonedDateTime endDate, Set<Exercise> exercises) {
        return generateCourse(id, startDate, endDate, exercises, UUID.randomUUID().toString(), UUID.randomUUID().toString(), UUID.randomUUID().toString());
    }

    public static TextSubmission generateTextSubmission(String text, Language language, boolean submitted) {
        TextSubmission textSubmission = new TextSubmission();
        textSubmission.text(text);
        textSubmission.setLanguage(language);
        textSubmission.setSubmitted(submitted);
        if (submitted) {
            textSubmission.setSubmissionDate(ZonedDateTime.now().minusDays(1));
        }
        return textSubmission;
    }

    public static FileUploadSubmission generateFileUploadSubmission(boolean submitted) {
        FileUploadSubmission fileUploadSubmission = new FileUploadSubmission();
        fileUploadSubmission.setSubmitted(submitted);
        if (submitted) {
            fileUploadSubmission.setSubmissionDate(ZonedDateTime.now().minusDays(1));
        }
        return fileUploadSubmission;
    }

    public static ModelingSubmission generateModelingSubmission(String model, boolean submitted) {
        ModelingSubmission submission = new ModelingSubmission();
        submission.setModel(model);
        submission.setSubmitted(submitted);
        if (submitted) {
            submission.setSubmissionDate(ZonedDateTime.now().minusDays(1));
        }
        return submission;
    }

    public static ExampleSubmission generateExampleSubmission(Submission submission, Exercise exercise, boolean usedForTutorial) {
        ExampleSubmission exampleSubmission = new ExampleSubmission();
        exampleSubmission.setSubmission(submission);
        exampleSubmission.setExercise(exercise);
        exampleSubmission.setUsedForTutorial(usedForTutorial);
        return exampleSubmission;
    }

    public static Course generateCourse(Long id, ZonedDateTime startDate, ZonedDateTime endDate, Set<Exercise> exercises, String studentGroupName,
            String teachingAssistantGroupName, String instructorGroupName) {
        Course course = new Course();
        course.setId(id);
        course.setTitle(UUID.randomUUID().toString());
        course.setDescription(UUID.randomUUID().toString());
        course.setShortName("t" + UUID.randomUUID().toString().substring(0, 3));
        course.setStudentGroupName(studentGroupName);
        course.setTeachingAssistantGroupName(teachingAssistantGroupName);
        course.setInstructorGroupName(instructorGroupName);
        course.setStartDate(startDate);
        course.setEndDate(endDate);
        course.setMaxComplaints(5);
        course.setExercises(exercises);
        course.setOnlineCourse(false);
        return course;
    }

    public static StudentParticipation generateStudentParticipation(InitializationState initializationState, Exercise exercise, User user) {
        StudentParticipation studentParticipation = new StudentParticipation();
        studentParticipation.setInitializationState(initializationState);
        studentParticipation.setInitializationDate(ZonedDateTime.now().minusDays(5));
        studentParticipation.setExercise(exercise);
        studentParticipation.setStudent(user);
        return studentParticipation;
    }

    public static Result generateResult(boolean rated, long score) {
        Result result = new Result();
        result.setRated(rated);
        result.setScore(score);
        return result;
    }
}
